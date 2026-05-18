import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

export function StatCard({ label, value, icon: Icon }: StatCardProps): JSX.Element {
  return (
    <article className="stat-box">
      <div>
        <p className="stat-label">{label}</p>
        <h3 className="stat-value">{value}</h3>
      </div>
      <span className="stat-icon" aria-hidden="true">
        <Icon size={20} />
      </span>
    </article>
  );
}
