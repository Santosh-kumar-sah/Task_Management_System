import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function extractMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    const apiMessage = error.response?.data?.message;

    if (typeof apiMessage === "string" && apiMessage.length > 0) {
      return apiMessage;
    }
  }

  return error instanceof Error ? error.message : "Registration failed";
}

export function Register(): JSX.Element {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);

    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (submissionError: unknown) {
      setError(extractMessage(submissionError));
    }
  };

  return (
    <main className="app-shell">
      <div className="page-shell auth-layout">
        <section className="surface auth-hero">
          <div>
            <div className="brand-mark">
              <span className="brand-badge">RA</span>
              Secure Task Platform
            </div>
            <h1>Register once, then manage work with protected access.</h1>
            <p>
              Create an account, receive a JWT access token, and move directly into a role-aware dashboard for tasks.
            </p>
          </div>
          <div className="auth-stats">
            <div className="stat-card">
              <strong>JWT</strong>
              <span>Stateless auth for horizontal scale</span>
            </div>
            <div className="stat-card">
              <strong>RBAC</strong>
              <span>User and admin access control</span>
            </div>
            <div className="stat-card">
              <strong>Prisma</strong>
              <span>Typed PostgreSQL data layer</span>
            </div>
          </div>
        </section>

        <section className="surface auth-card">
          <div className="card-inner">
            <div className="section-title">Create account</div>
            <p className="page-subtitle">Use your name, email, and password to register.</p>

            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  type="text"
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  type="email"
                  placeholder="jane@example.com"
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  type="password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />
              </div>

              {error ? <div className="error-text">{error}</div> : null}

              <button className="button button-primary" type="submit">
                Register
              </button>
            </form>

            <p className="auth-footer">
              Already have an account? <Link className="muted-link" to="/login">Log in</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
