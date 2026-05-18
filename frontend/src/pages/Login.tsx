import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle, Lock, Mail } from "lucide-react";
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
    remember: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (submissionError: unknown) {
      setError(extractMessage(submissionError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page auth-login">
      <div className="bg-blob blob-one" />
      <div className="bg-blob blob-two" />
      <div className="auth-card">
        <div className="auth-card-top">
          <span className="auth-icon" aria-hidden="true">
            <Lock size={20} />
          </span>
          <h1>Welcome Back</h1>
          <p>Sign in to your TaskFlow account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {error ? <div className="form-banner error">⚠ {error}</div> : null}

          <label className="floating-field" htmlFor="login-email">
            <span className="field-icon">
              <Mail size={16} />
            </span>
            <input
              id="login-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder=" "
              required
              disabled={submitting}
              aria-label="Email Address"
            />
            <span>Email Address</span>
          </label>

          <label className="floating-field" htmlFor="login-password">
            <span className="field-icon">
              <Lock size={16} />
            </span>
            <input
              id="login-password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder=" "
              required
              disabled={submitting}
              aria-label="Password"
            />
            <span>Password</span>
          </label>

          <div className="auth-row">
            <label className="check-row" htmlFor="remember-me">
              <input
                id="remember-me"
                type="checkbox"
                checked={form.remember}
                onChange={(event) => setForm((current) => ({ ...current, remember: event.target.checked }))}
                disabled={submitting}
              />
              <span>Remember me</span>
            </label>
            <button type="button" className="link-muted" disabled aria-disabled="true">
              Forgot password?
            </button>
          </div>

          <button className="btn btn-gradient full" type="submit" disabled={submitting}>
            {submitting ? <LoaderCircle className="spin" size={16} /> : null}
            {submitting ? "Signing in..." : "Sign In"}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="auth-text-center">
            Don&apos;t have an account? <Link to="/register">Sign Up</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
