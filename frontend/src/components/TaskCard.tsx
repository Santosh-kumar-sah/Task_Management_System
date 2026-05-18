import { useState } from "react";
import type { TaskFormValues } from "./TaskForm";
import { TaskForm } from "./TaskForm";

export interface TaskItem {
  id: number;
  title: string;
  description: string | null;
  status: TaskFormValues["status"];
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: TaskItem;
  isAdminView: boolean;
  onUpdate: (taskId: number, values: TaskFormValues) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

function formatDate(dateValue: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateValue));
}

function statusClassName(status: TaskFormValues["status"]): string {
  return status.toLowerCase();
}

export function TaskCard({ task, isAdminView, onUpdate, onDelete }: TaskCardProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialValues: TaskFormValues = {
    title: task.title,
    description: task.description ?? "",
    status: task.status,
  };

  const handleUpdate = async (values: TaskFormValues): Promise<void> => {
    setError(null);
    await onUpdate(task.id, values);
    setIsEditing(false);
  };

  const handleDelete = async (): Promise<void> => {
    setError(null);
    await onDelete(task.id);
  };

  if (isEditing) {
    return (
      <article className="task-card inline-form">
        <TaskForm
          initialValues={initialValues}
          submitLabel="Save changes"
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          error={error}
        />
      </article>
    );
  }

  return (
    <article className="task-card">
      <div className="task-meta">
        <span className={`status-pill ${statusClassName(task.status)}`}>{task.status.replace("_", " ")}</span>
        <span>{formatDate(task.createdAt)}</span>
      </div>

      <div>
        <h3>{task.title}</h3>
        {task.description ? <p className="helper-text">{task.description}</p> : <p className="helper-text">No description provided.</p>}
      </div>

      <div className="task-meta">
        <span>Task #{task.id}</span>
        <span>Owner #{isAdminView ? task.userId : "me"}</span>
      </div>

      <div className="button-row">
        <button className="button button-secondary" type="button" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className="button button-danger" type="button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}
