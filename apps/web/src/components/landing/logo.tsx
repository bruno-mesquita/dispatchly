export function DLogo({ size = 22 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			style={{ flexShrink: 0 }}
		>
			<rect
				x="2"
				y="2"
				width="20"
				height="20"
				rx="4"
				fill="var(--foreground)"
			/>
			<path
				d="M7 8.5 L11 12 L7 15.5"
				stroke="#FAFAF7"
				strokeWidth="1.7"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
			<path
				d="M13 8.5 L17 12 L13 15.5"
				stroke="#FAFAF7"
				strokeWidth="1.7"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
				opacity="0.55"
			/>
		</svg>
	);
}

export function DWordmark({ size = 22 }: { size?: number }) {
	return (
		<div
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: 8,
				color: "var(--foreground)",
				letterSpacing: -0.3,
			}}
		>
			<DLogo size={size} />
			<span
				style={{
					fontWeight: 600,
					fontSize: size * 0.82,
					letterSpacing: -0.5,
					fontFamily: "var(--font-sans)",
				}}
			>
				Dispatchly
			</span>
		</div>
	);
}
