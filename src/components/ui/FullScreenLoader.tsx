import React from "react";

interface FullScreenLoaderProps {
    open: boolean;
    title?: string;
    subtitle?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
    open,
    title = "Loading...",
    subtitle
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            <div className="bg-white rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center gap-4 w-[300px]">

                {/* Spinner */}
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />

                {/* Title */}
                <div className="text-lg font-semibold text-slate-700 text-center">
                    {title}
                </div>

                {/* Subtitle */}
                {subtitle && (
                    <div className="text-sm text-slate-500 text-center">
                        {subtitle}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FullScreenLoader;