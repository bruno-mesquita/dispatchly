import { redirect } from "next/navigation";

export default function DocsPage() {
	// Redirect to external docs or landing for now
	redirect("https://docs.dispatchly.io");
}
