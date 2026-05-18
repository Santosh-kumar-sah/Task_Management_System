export function Footer(): JSX.Element {
  const docsUrl = `${import.meta.env.VITE_API_URL ?? "http://localhost:5000"}/api/docs`;

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section>
          <div className="brand-link footer-brand">
            <span className="brand-icon" aria-hidden="true" />
            <strong>TaskFlow</strong>
          </div>
          <p>Manage your tasks efficiently with role-based access control</p>
          <small>© 2025 TaskFlow. Built for internship assignment.</small>
        </section>

        <section>
          <h4>Built With</h4>
          <ul>
            <li>Node.js + Express</li>
            <li>PostgreSQL + Prisma</li>
            <li>React + TypeScript</li>
            <li>JWT Auth</li>
          </ul>
        </section>

        <section>
          <h4>Resources</h4>
          <ul>
            <li>
              <a href={docsUrl} target="_blank" rel="noreferrer">
                API Documentation
              </a>
            </li>
            <li>
              <a href="#" rel="noreferrer">
                GitHub Repository
              </a>
            </li>
            <li>
              <a href={docsUrl} target="_blank" rel="noreferrer">
                Swagger UI
              </a>
            </li>
          </ul>
        </section>
      </div>

      <div className="footer-bottom">Designed & Developed with ♥ for Backend Intern Assignment</div>
    </footer>
  );
}
