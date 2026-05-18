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

  return error instanceof Error ? error.message : "Login failed";
}

export function Login(): JSX.Element {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);

    try {
      await login(form.email, form.password);
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
            <h1>Sign in and resume your protected task workspace.</h1>
            <p>
              The dashboard fetches tasks with the JWT stored in localStorage and keeps the API calls authenticated.
            </p>
          </div>
          <div className="auth-stats">
            <div className="stat-card">
              <strong>401</strong>
              <span>Auto-redirects back to login on expiry</span>
            </div>
            <div className="stat-card">
              <strong>Axios</strong>
              <span>Interceptor attaches the bearer token</span>
            </div>
            <div className="stat-card">
              <strong>Cards</strong>
              <span>Task CRUD rendered in a responsive grid</span>
            </div>
          </div>
        </section>

        <section className="surface auth-card">
          <div className="card-inner">
            <div className="section-title">Welcome back</div>
            <p className="page-subtitle">Use the email and password from your account.</p>

            <form className="form-grid" onSubmit={handleSubmit}>
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
                  placeholder="Your password"
                  required
                />
              </div>

              {error ? <div className="error-text">{error}</div> : null}

              <button className="button button-primary" type="submit">
                Login
              </button>
            </form>

            <p className="auth-footer">
              Need an account? <Link className="muted-link" to="/register">Register</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
