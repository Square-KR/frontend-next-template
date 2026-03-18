import { useToast as useWdsToast } from "@wanteddev/wds";

export const useToast = () => {
	const toast = useWdsToast();

	return {
		success: (message: string) => toast({ content: message, variant: "positive" }),
		error: (message: string) => toast({ content: message, variant: "negative" }),
		info: (message: string) => toast({ content: message, variant: "normal" }),
		warning: (message: string) => toast({ content: message, variant: "cautionary" }),
	};
};
