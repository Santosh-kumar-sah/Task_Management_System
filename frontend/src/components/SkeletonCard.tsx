export function SkeletonCard(): JSX.Element {
  return (
    <article className="task-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-line short" />
      <div className="skeleton skeleton-line medium" />
      <div className="skeleton skeleton-line long" />
      <div className="skeleton skeleton-line medium" />
    </article>
  );
}
