"use client";

import { useState } from "react";

export type JourneyNode = {
	id: string;
	type: string;
	position: { x: number; y: number };
	data: Record<string, unknown>;
};

export type JourneyEdge = {
	id: string;
	source: string;
	target: string;
	sourceHandle?: string | null;
	targetHandle?: string | null;
};

export type JourneyStatus = "draft" | "active" | "paused" | "archived";

export type Journey = {
	id: string;
	name: string;
	description?: string;
	status: JourneyStatus;
	nodes: JourneyNode[];
	edges: JourneyEdge[];
	createdAt: string;
};

const INITIAL_JOURNEYS: Journey[] = [
	{
		id: "jrn_1",
		name: "Onboarding Welcome",
		description:
			"Send welcome email after signup, follow up with SMS if unopened",
		status: "active",
		nodes: [
			{
				id: "n1",
				type: "trigger",
				position: { x: 250, y: 50 },
				data: { event: "user.signup" },
			},
			{
				id: "n2",
				type: "action",
				position: { x: 250, y: 180 },
				data: { channel: "email", template: "welcome_v3" },
			},
			{
				id: "n3",
				type: "wait",
				position: { x: 250, y: 310 },
				data: { duration: 3, unit: "days" },
			},
			{
				id: "n4",
				type: "branch",
				position: { x: 250, y: 440 },
				data: { condition: "email.opened == false" },
			},
			{
				id: "n5",
				type: "action",
				position: { x: 100, y: 570 },
				data: { channel: "sms", template: "reminder_sms" },
			},
		],
		edges: [
			{ id: "e1", source: "n1", target: "n2" },
			{ id: "e2", source: "n2", target: "n3" },
			{ id: "e3", source: "n3", target: "n4" },
			{ id: "e4", source: "n4", target: "n5", sourceHandle: "yes" },
		],
		createdAt: "2024-03-01T10:00:00Z",
	},
	{
		id: "jrn_2",
		name: "Payment Reminder",
		description: "Remind users of upcoming invoice via push then email",
		status: "draft",
		nodes: [
			{
				id: "n1",
				type: "trigger",
				position: { x: 250, y: 50 },
				data: { event: "invoice.due_soon" },
			},
			{
				id: "n2",
				type: "action",
				position: { x: 250, y: 180 },
				data: { channel: "push", template: "invoice_push" },
			},
		],
		edges: [{ id: "e1", source: "n1", target: "n2" }],
		createdAt: "2024-04-10T08:00:00Z",
	},
];

let nextId = 3;
let nextNodeId = 100;
let nextEdgeId = 100;

export function generateNodeId() {
	return `n${nextNodeId++}`;
}

export function generateEdgeId() {
	return `e${nextEdgeId++}`;
}

const store: Journey[] = [...INITIAL_JOURNEYS];

export function useJourneys() {
	// TODO: replace with trpc.journeys.list.useQuery()
	const [journeys, setJourneys] = useState<Journey[]>(store);

	function create(data: { name: string; description?: string }): Journey {
		// TODO: replace with trpc.journeys.create.useMutation()
		const journey: Journey = {
			...data,
			id: `jrn_${nextId++}`,
			status: "draft",
			nodes: [
				{
					id: "n1",
					type: "trigger",
					position: { x: 250, y: 80 },
					data: { event: "" },
				},
			],
			edges: [],
			createdAt: new Date().toISOString(),
		};
		store.push(journey);
		setJourneys([...store]);
		return journey;
	}

	function update(
		id: string,
		data: Partial<Pick<Journey, "name" | "description" | "status">>,
	) {
		// TODO: replace with trpc.journeys.update.useMutation()
		const idx = store.findIndex((j) => j.id === id);
		if (idx !== -1) {
			store[idx] = { ...store[idx], ...data };
			setJourneys([...store]);
		}
	}

	function updateFlow(id: string, nodes: JourneyNode[], edges: JourneyEdge[]) {
		// TODO: replace with trpc.journeys.updateFlow.useMutation()
		const idx = store.findIndex((j) => j.id === id);
		if (idx !== -1) {
			store[idx] = { ...store[idx], nodes, edges };
			setJourneys([...store]);
		}
	}

	function remove(id: string) {
		// TODO: replace with trpc.journeys.delete.useMutation()
		const idx = store.findIndex((j) => j.id === id);
		if (idx !== -1) {
			store.splice(idx, 1);
			setJourneys([...store]);
		}
	}

	return {
		journeys,
		create,
		update,
		updateFlow,
		remove,
		isLoading: false as const,
		error: null,
	};
}

export function useJourney(id: string) {
	// TODO: replace with trpc.journeys.getById.useQuery({ id })
	const [journey, setJourney] = useState<Journey | null>(
		store.find((j) => j.id === id) ?? null,
	);

	function updateFlow(nodes: JourneyNode[], edges: JourneyEdge[]) {
		// TODO: replace with trpc.journeys.updateFlow.useMutation()
		const idx = store.findIndex((j) => j.id === id);
		if (idx !== -1) {
			store[idx] = { ...store[idx], nodes, edges };
			setJourney({ ...store[idx] });
		}
	}

	return {
		journey,
		updateFlow,
		isLoading: false as const,
	};
}
