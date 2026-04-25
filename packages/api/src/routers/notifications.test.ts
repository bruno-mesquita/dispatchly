import { describe, expect, it, mock, beforeEach } from "bun:test";

// Mock environment
process.env.DATABASE_URL = "mongodb://localhost:27017/test";
process.env.BETTER_AUTH_SECRET = "a".repeat(32);
process.env.BETTER_AUTH_URL = "http://localhost:3000";
process.env.CORS_ORIGIN = "http://localhost:3000";
process.env.REDIS_URL = "redis://localhost:6379";
process.env.RESEND_API_KEY = "re_test";
process.env.RESEND_FROM_EMAIL = "test@example.com";

// Mock dependencies
const mockCheckQuota = mock(() => Promise.resolve({ allowed: true, remaining: 100 }));
const mockIncrementUsage = mock(() => Promise.resolve());
const mockAddToQueue = mock(() => Promise.resolve());
const mockApplyTemplate = mock((id, vars) => Promise.resolve({ subject: "Rendered Subject", content: "Rendered Content" }));

mock.module("@dispatchly/billing", () => ({
  checkQuota: mockCheckQuota,
  incrementUsage: mockIncrementUsage,
  PLANS: [
    { id: "free", limits: { emails: 100, sms: 50, push: 100 } }
  ]
}));

mock.module("@dispatchly/notifications", () => ({
  addToQueue: mockAddToQueue
}));

mock.module("@dispatchly/templates", () => ({
  applyTemplate: mockApplyTemplate
}));

// Mock DB models
const mockNotificationLogSave = mock(function(this: any) { 
  this._id = "mock_log_id";
  return Promise.resolve(this); 
});

mock.module("@dispatchly/db", () => {
  function MockNotificationLog(data: any) {
    Object.assign(this, data);
  }
  MockNotificationLog.prototype.save = mockNotificationLogSave;
  MockNotificationLog.find = mock(() => ({
    sort: () => ({
      limit: () => ({
        skip: () => Promise.resolve([])
      })
    })
  }));
  MockNotificationLog.aggregate = mock(() => Promise.resolve([]));

  return {
    NotificationLog: MockNotificationLog,
    Organization: {
      findOne: mock(() => ({
        select: () => ({
          lean: () => Promise.resolve({ _id: "org_123" })
        })
      }))
    },
    client: {
      db: () => ({})
    },
    connect: () => Promise.resolve()
  };
});

// Import router after mocks
const { notificationsRouter } = await import("./notifications.js");

describe("Notifications Router", () => {
  beforeEach(() => {
    mockCheckQuota.mockClear();
    mockIncrementUsage.mockClear();
    mockAddToQueue.mockClear();
    mockApplyTemplate.mockClear();
    mockNotificationLogSave.mockClear();
  });

  const mockCtx = {
    session: { user: { id: "user_1", email: "user@example.com" } },
    orgId: "org_123",
  };

  it("sends a notification successfully and increments usage", async () => {
    const caller = notificationsRouter.createCaller(mockCtx as any);
    
    const result = await caller.send({
      type: "email",
      to: "test@example.com",
      subject: "Hello",
      content: "World"
    });

    expect(result.status).toBe("pending");
    expect(mockCheckQuota).toHaveBeenCalledWith("org_123", "emails");
    expect(mockAddToQueue).toHaveBeenCalled();
    
    // This is expected to FAIL currently
    expect(mockIncrementUsage).toHaveBeenCalledWith("org_123", "emails", 1);
  });

  it("fails when quota is exceeded", async () => {
    mockCheckQuota.mockImplementationOnce(() => Promise.resolve({ allowed: false, remaining: 0 }));
    const caller = notificationsRouter.createCaller(mockCtx as any);

    try {
      await caller.send({
        type: "email",
        to: "test@example.com",
        subject: "Hello",
        content: "World"
      });
      expect(true).toBe(false); // Should not reach here
    } catch (e: any) {
      expect(e.message).toBe("Quota exceeded");
    }
    
    expect(mockAddToQueue).not.toHaveBeenCalled();
    expect(mockIncrementUsage).not.toHaveBeenCalled();
  });
});
