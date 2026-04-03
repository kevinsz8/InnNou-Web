import clsx from "clsx";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const TextBox: React.FC<Props> = ({ error, ...props }) => {
    return (
        <div>
            <input
                {...props}
                className={clsx(
                    "w-full px-4 py-2 border rounded-lg transition focus:outline-none focus:ring-2",
                    error
                        ? "border-red-500 focus:ring-red-400 bg-red-50"
                        : "border-slate-300 focus:ring-slate-400"
                )}
            />

            {error && (
                <p className="text-red-500 text-xs mt-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default TextBox;