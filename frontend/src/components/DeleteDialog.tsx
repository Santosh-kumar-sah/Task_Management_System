import { AlertTriangle } from "lucide-react";

interface DeleteDialogProps {
  isOpen: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteDialog({ isOpen, loading, onCancel, onConfirm }: DeleteDialogProps): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <section className="dialog-card" role="dialog" aria-modal="true" aria-label="Delete task confirmation" onClick={(event) => event.stopPropagation()}>
        <span className="dialog-icon" aria-hidden="true">
          <AlertTriangle size={18} />
        </span>
        <h3>Delete Task?</h3>
        <p>This action cannot be undone.</p>

        <div className="dialog-actions">
          <button className="btn btn-ghost" type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" type="button" onClick={() => void onConfirm()} disabled={loading}>
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}
