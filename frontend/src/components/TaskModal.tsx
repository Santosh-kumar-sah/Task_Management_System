import { useEffect, useState, type FormEvent } from "react";
import { LoaderCircle, X } from "lucide-react";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
}

interface TaskModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialValues?: TaskFormValues;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}

const defaultValues: TaskFormValues = {
  title: "",
  description: "",
  status: "TODO",
};

export function TaskModal({ isOpen, mode, initialValues, loading, error, onClose, onSubmit }: TaskModalProps): JSX.Element | null {
  const [values, setValues] = useState<TaskFormValues>(defaultValues);

  useEffect(() => {
    if (isOpen) {
      setValues(initialValues ?? defaultValues);
    }
  }, [initialValues, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    await onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
    });
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-label={mode === "create" ? "Create New Task" : "Edit Task"} onClick={(event) => event.stopPropagation()}>
        <header className="modal-head">
          <h3>{mode === "create" ? "Create New Task" : "Edit Task"}</h3>
          <button type="button" onClick={onClose} aria-label="Close task modal">
            <X size={18} />
          </button>
        </header>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            type="text"
            value={values.title}
            onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
            required
            maxLength={120}
            disabled={loading}
          />

          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            rows={3}
            value={values.description}
            onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
            disabled={loading}
            maxLength={1000}
          />

          <label htmlFor="task-status">Status</label>
          <select
            id="task-status"
            value={values.status}
            onChange={(event) => setValues((current) => ({ ...current, status: event.target.value as TaskStatus }))}
            disabled={loading}
          >
            <option value="TODO">📋 TODO</option>
            <option value="IN_PROGRESS">⏳ IN PROGRESS</option>
            <option value="DONE">✅ DONE</option>
          </select>

          {error ? <div className="form-banner error">⚠ {error}</div> : null}

          <footer className="modal-actions">
            <button className="btn btn-ghost" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-accent" type="submit" disabled={loading}>
              {loading ? <LoaderCircle size={16} className="spin" /> : null}
              {mode === "create" ? "Save" : "Update"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
