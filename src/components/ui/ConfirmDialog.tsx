import Button from "./Button";

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({
    open,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    onConfirm,
    onCancel
}: ConfirmDialogProps) => {

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Dialog */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">

                <h2 className="text-lg font-semibold text-slate-800 mb-2">
                    {title}
                </h2>

                <p className="text-slate-600 mb-6">
                    {description}
                </p>

                <div className="flex justify-end gap-2">

                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmText}
                    </Button>

                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;