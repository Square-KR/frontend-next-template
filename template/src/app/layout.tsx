import "src/app/global.css";
import Providers from "src/widgets/layouts/provider";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
	title: "Snaply",
	description: "Snaply",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning className={dmSans.variable}>
			<head>
				<link rel="icon" href="/images/logo/favicon.png" />
			</head>
			<body className="font-sans antialiased">
				<div id="modal" />
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
