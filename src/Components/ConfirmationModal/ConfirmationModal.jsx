export default function ConfirmationModal({
    isOpen,
    title = "Confirm Delete",
    message = "Are you sure you want to delete this item?",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                className="absolute inset-0 border-0 bg-black/50"
                aria-label="Close confirmation dialog"
                onClick={onCancel}
            />
            <div
                className="relative z-10 w-full max-w-sm rounded-md bg-white p-5 shadow-xl"
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm mb-5">{message}</p>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="button button-secondary"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className="button button-primary"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
