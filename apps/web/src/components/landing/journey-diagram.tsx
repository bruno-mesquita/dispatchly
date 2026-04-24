import { PulseDot } from "./pulse-dot";

function JourneyNode({
	type,
	title,
	sub,
	highlight = false,
}: {
	type: string;
	title: string;
	sub?: string;
	highlight?: boolean;
}) {
	const icons: Record<string, React.ReactNode> = {
		trigger: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				aria-hidden="true"
			>
				<path d="M7 1v6l4 2" />
				<circle cx="7" cy="7" r="6" />
			</svg>
		),
		email: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				aria-hidden="true"
			>
				<rect x="1" y="3" width="12" height="8" rx="1" />
				<path d="M1 4l6 4 6-4" />
			</svg>
		),
		wait: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				aria-hidden="true"
			>
				<circle cx="7" cy="7" r="6" />
				<path d="M7 4v3l2 2" />
			</svg>
		),
		branch: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				aria-hidden="true"
			>
				<path d="M3 1v4M11 1v4M3 5a4 4 0 007 0M7 8v5" />
			</svg>
		),
		sms: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				aria-hidden="true"
			>
				<path d="M1 3h12v7H6l-3 3v-3H1z" />
			</svg>
		),
		push: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				aria-hidden="true"
			>
				<rect x="3" y="1" width="8" height="12" rx="1.5" />
				<path d="M6 10.5h2" />
			</svg>
		),
	};
	return (
		<div
			style={{
				background: highlight ? "var(--accent-tint)" : "var(--surface)",
				border:
					"1px solid " + (highlight ? "var(--accent)" : "var(--hairline)"),
				borderRadius: 6,
				padding: "10px 12px",
				minWidth: 150,
				display: "flex",
				flexDirection: "column",
				gap: 2,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 8,
					color: highlight ? "var(--accent)" : "var(--fg-dim)",
				}}
			>
				{icons[type]}
				<span
					style={{
						fontSize: 10,
						fontWeight: 600,
						textTransform: "uppercase",
						letterSpacing: 0.6,
						color: "var(--fg-dim)",
					}}
				>
					{type}
				</span>
				{type === "trigger" && (
					<span style={{ marginLeft: "auto" }}>
						<PulseDot color="var(--ok)" size={5} />
					</span>
				)}
			</div>
			<div
				style={{
					fontSize: 13,
					fontWeight: 500,
					color: "var(--fg)",
					marginTop: 2,
				}}
			>
				{title}
			</div>
			{sub && (
				<div
					style={{
						fontSize: 10.5,
						color: "var(--fg-dim)",
						fontFamily: "var(--font-mono)",
					}}
				>
					{sub}
				</div>
			)}
		</div>
	);
}

function ArrowDown() {
	return (
		<svg
			width="10"
			height="20"
			viewBox="0 0 10 20"
			fill="none"
			aria-hidden="true"
			style={{ flexShrink: 0 }}
		>
			<path
				d="M5 0v16M1 13l4 4 4-4"
				stroke="var(--fg-dim)"
				strokeWidth="1.2"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function JourneyDiagram() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 6,
				padding: "24px 20px",
				background: "var(--bg-alt)",
				borderRadius: 8,
				border: "1px solid var(--hairline)",
			}}
		>
			<JourneyNode
				type="trigger"
				title="user.signup"
				sub="server event"
				highlight
			/>
			<ArrowDown />
			<JourneyNode
				type="email"
				title="Welcome email"
				sub="template: welcome_v3"
			/>
			<ArrowDown />
			<JourneyNode type="wait" title="Wait 3 days" sub="check: opened?" />
			<ArrowDown />
			<JourneyNode type="branch" title="Not opened?" sub="if opened = false" />
			<div
				style={{
					display: "flex",
					gap: 16,
					alignItems: "flex-start",
					marginTop: 4,
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 4,
					}}
				>
					<div
						style={{
							fontSize: 9.5,
							fontFamily: "var(--font-mono)",
							color: "var(--fg-dim)",
							textTransform: "uppercase",
							letterSpacing: 0.5,
						}}
					>
						yes
					</div>
					<JourneyNode type="sms" title="Reminder SMS" />
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 4,
					}}
				>
					<div
						style={{
							fontSize: 9.5,
							fontFamily: "var(--font-mono)",
							color: "var(--fg-dim)",
							textTransform: "uppercase",
							letterSpacing: 0.5,
						}}
					>
						no
					</div>
					<JourneyNode type="push" title="Push nudge" />
				</div>
			</div>
		</div>
	);
}
