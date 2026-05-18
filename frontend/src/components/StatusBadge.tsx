import type { TaskStatus } from "./TaskModal";

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps): JSX.Element {
  const label = status === "IN_PROGRESS" ? "IN PROGRESS" : status;

  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      <span className="status-dot" aria-hidden="true" />
      {label}
    </span>
  );
}
