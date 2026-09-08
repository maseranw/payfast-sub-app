import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Never Mind",
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isConfirming) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, isConfirming, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-neutral-950/70 dark:bg-black/80 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md bg-white dark:bg-neutral-950 shadow-2xl p-8 animate-scale-in">
        <h2
          id="confirm-dialog-title"
          className="text-2xl font-black tracking-tight text-neutral-950 dark:text-white mb-3"
        >
          {title}
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">
          {description}
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="flex-1 py-3.5 rounded-full text-xs font-bold uppercase tracking-wide text-neutral-950 dark:text-white bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-bold uppercase tracking-wide text-white bg-red-600 hover:bg-red-700 transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isConfirming && (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
