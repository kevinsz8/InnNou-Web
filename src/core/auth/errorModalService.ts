let showErrorFn: ((message: string) => void) | null = null;

export const registerErrorModal = (fn: (message: string) => void) => {
    showErrorFn = fn;
};

export const showGlobalErrorModal = (message: string) => {
    showErrorFn?.(message);
};