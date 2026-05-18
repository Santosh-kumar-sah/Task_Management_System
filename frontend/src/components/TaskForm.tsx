import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
}

interface TaskFormProps {
  initialValues?: TaskFormValues;
  submitLabel: string;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel?: () => void;
  error?: string | null;
}

const emptyValues: TaskFormValues = {
  title: "",
  description: "",
  status: "TODO",
};

function extractMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    const apiMessage = error.response?.data?.message;

    if (typeof apiMessage === "string" && apiMessage.length > 0) {
      return apiMessage;
    }
  }

  return error instanceof Error ? error.message : "Unable to save task";
}

export function TaskForm({ initialValues, submitLabel, onSubmit, onCancel, error }: TaskFormProps): JSX.Element {
  const [values, setValues] = useState<TaskFormValues>(initialValues ?? emptyValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(error ?? null);

  useEffect(() => {
    setValues(initialValues ?? emptyValues);
  }, [initialValues?.title, initialValues?.description, initialValues?.status]);

  useEffect(() => {
    setLocalError(error ?? null);
  }, [error]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    setLocalError(null);

    try {
      await onSubmit({
        title: values.title.trim(),
        description: values.description.trim(),
        status: values.status,
      });
    } catch (submissionError: unknown) {
      setLocalError(extractMessage(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={values.title}
          placeholder="Enter a task title"
          onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
          required
          maxLength={120}
        />
      </div>

      <div className="form-row">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={values.description}
          placeholder="Add supporting details"
          onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
          maxLength={1000}
        />
      </div>

      <div className="form-row">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={values.status}
          onChange={(event) => setValues((current) => ({ ...current, status: event.target.value as TaskStatus }))}
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      </div>

      {localError ? <div className="error-text">{localError}</div> : null}

      <div className="button-row">
        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button className="button button-secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
