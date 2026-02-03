const noop = (_message: string) => {};

/**
 * Stub useToast hook.
 * Replace this with a real toast implementation (e.g. sonner, react-hot-toast).
 */
export const useToast = () => ({
	success: noop,
	error: noop,
	info: noop,
	warning: noop,
});
