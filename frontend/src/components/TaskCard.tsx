import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { TaskStatus } from "./TaskModal";
import { StatusBadge } from "./StatusBadge";

export interface TaskItem {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: TaskItem;
  isAdminView: boolean;
  isRemoving: boolean;
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
}

function formatDate(dateValue: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(dateValue));
}

export function TaskCard({ task, isAdminView, isRemoving, onEdit, onDelete }: TaskCardProps): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const owner = useMemo(() => (isAdminView ? `Owner #${task.userId}` : "Owner #me"), [isAdminView, task.userId]);

  return (
    <article className={`task-card status-border-${task.status.toLowerCase()} ${isRemoving ? "removing" : ""}`}>
      <header className="task-card-head">
        <StatusBadge status={task.status} />

        <div className="task-menu-wrap">
          <button
            type="button"
            className="icon-btn"
            aria-label="Open task actions"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <EllipsisVertical size={16} />
          </button>

          {menuOpen ? (
            <div className="task-menu" role="menu">
              <button type="button" onClick={() => onEdit(task)}>
                Edit
              </button>
              <button type="button" onClick={() => onDelete(task)}>
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <h3>{task.title}</h3>
      <p className="task-desc">{task.description || "No description provided."}</p>

      <footer className="task-card-foot">
        <span>{formatDate(task.createdAt)}</span>
        <span>{owner}</span>
        <div className="icon-actions">
          <button className="icon-btn" type="button" onClick={() => onEdit(task)} aria-label="Edit task">
            <Pencil size={14} />
          </button>
          <button className="icon-btn danger" type="button" onClick={() => onDelete(task)} aria-label="Delete task">
            <Trash2 size={14} />
          </button>
        </div>
      </footer>
    </article>
  );
}
