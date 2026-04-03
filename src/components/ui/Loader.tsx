const Loader = ({
    size = 6,
    overlay = false
}: {
    size?: number;
    overlay?: boolean;
}) => {

    const spinner = (
        <svg
            className="animate-spin text-slate-500"
            style={{ height: size * 4, width: size * 4 }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
            />
        </svg>
    );

    if (overlay) {
        return (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-none flex items-center justify-center z-10 rounded-xl">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center py-6">
            {spinner}
        </div>
    );
};

export default Loader;