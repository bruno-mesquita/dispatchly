"use client";

import type { VariableMap } from "@/types/email-builder";

interface VariablePanelProps {
	variables: string[];
	variableMap: VariableMap;
	onChange: (name: string, value: string) => void;
}

export function VariablePanel({
	variables,
	variableMap,
	onChange,
}: VariablePanelProps) {
	if (variables.length === 0) {
		return (
			<p className="text-muted-foreground text-xs">
				No variables detected. Use{" "}
				<code className="rounded bg-muted px-1 py-0.5 font-mono">
					{"{{name}}"}
				</code>{" "}
				syntax in text blocks.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{variables.map((name) => (
				<div key={name} className="flex flex-col gap-1">
					<label
						htmlFor={`var-${name}`}
						className="font-mono text-muted-foreground text-xs"
					>
						{`{{${name}}}`}
					</label>
					<input
						id={`var-${name}`}
						type="text"
						value={variableMap[name] ?? ""}
						onChange={(e) => onChange(name, e.target.value)}
						placeholder={`Sample value for ${name}`}
						className="rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
					/>
				</div>
			))}
		</div>
	);
}
