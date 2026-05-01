import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

export function getContext() {
	const queryClient = new QueryClient();

	return {
		queryClient,
	};
}

type TanstackQueryProviderProps = {
	queryClient: QueryClient;
	children: ReactNode;
};

export default function TanstackQueryProvider({
	queryClient,
	children,
}: TanstackQueryProviderProps) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
