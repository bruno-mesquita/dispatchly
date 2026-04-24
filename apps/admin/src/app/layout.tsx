import type { Metadata } from "next";
import {
	Geist,
	Geist_Mono,
	Instrument_Serif,
	JetBrains_Mono,
} from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
	weight: ["400", "500"],
});

const instrumentSerif = Instrument_Serif({
	variable: "--font-instrument-serif",
	subsets: ["latin"],
	weight: "400",
	style: ["normal", "italic"],
});

export const metadata: Metadata = {
	title: "Dispatchly — Admin Panel",
	description: "Internal management for Dispatchly infrastructure.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} antialiased`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
