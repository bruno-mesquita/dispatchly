"use client";

interface LivePreviewProps {
	html: string;
}

export function LivePreview({ html }: LivePreviewProps) {
	return (
		<iframe
			srcDoc={html}
			title="Email Preview"
			sandbox="allow-same-origin"
			className="h-full w-full border-0"
		/>
	);
}
