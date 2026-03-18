import { ThemeProvider } from "@wanteddev/wds";
import { AppRouterCacheProvider } from "@wanteddev/wds-nextjs";
import "src/app/global.css";
import Providers from "src/widgets/layouts/provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Snaply",
	description: "Snaply",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/images/logo/favicon.png" />
			</head>
			<body className="font-sans antialiased">
				<ThemeProvider>
					<AppRouterCacheProvider>
						<div id="modal" />
						<Providers>{children}</Providers>
					</AppRouterCacheProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
