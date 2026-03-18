"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

type Props = { children: ReactNode };

const Providers = ({ children }: Props) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 30,
						gcTime: 1000 * 60 * 5,
						refetchOnWindowFocus: true,
						refetchOnReconnect: true,
						refetchOnMount: "always",
						retry: 1,
					},
					mutations: {
						retry: 0,
					},
				},
			}),
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default Providers;
