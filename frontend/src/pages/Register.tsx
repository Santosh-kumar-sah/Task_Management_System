import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle, Lock, Mail, UserRound } from "lucide-react";
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
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const passwordStrength = (() => {
    const value = form.password;

    if (value.length < 6) {
      return { label: "Weak", className: "weak", score: 1 };
    }

    if (value.length < 10 || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
      return { label: "Medium", className: "medium", score: 2 };
    }

    return { label: "Strong", className: "strong", score: 3 };
  })();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await register(form.name, form.email, form.password);
      setSuccess("Account created successfully. Redirecting to dashboard...");
      window.setTimeout(() => navigate("/dashboard"), 700);
    } catch (submissionError: unknown) {
      setError(extractMessage(submissionError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page auth-register">
      <div className="auth-card">
        <div className="auth-card-top">
          <span className="auth-icon" aria-hidden="true">
            <UserRound size={20} />
          </span>
          <h1>Create Account</h1>
          <p>Join TaskFlow and start managing your tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {error ? <div className="form-banner error">⚠ {error}</div> : null}
          {success ? <div className="form-banner success">✓ {success}</div> : null}

          <label className="floating-field" htmlFor="register-name">
            <span className="field-icon">
              <UserRound size={16} />
            </span>
            <input
              id="register-name"
              type="text"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder=" "
              required
              disabled={submitting}
              aria-label="Full Name"
            />
            <span>Full Name</span>
          </label>

          <label className="floating-field" htmlFor="register-email">
            <span className="field-icon">
              <Mail size={16} />
            </span>
            <input
              id="register-email"
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

          <label className="floating-field" htmlFor="register-password">
            <span className="field-icon">
              <Lock size={16} />
            </span>
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder=" "
              minLength={8}
              required
              disabled={submitting}
              aria-label="Password"
            />
            <span>Password</span>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={submitting}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </label>

          <div className="strength-meter" aria-label={`Password strength: ${passwordStrength.label}`}>
            <span className={`bar ${passwordStrength.score >= 1 ? passwordStrength.className : ""}`} />
            <span className={`bar ${passwordStrength.score >= 2 ? passwordStrength.className : ""}`} />
            <span className={`bar ${passwordStrength.score >= 3 ? passwordStrength.className : ""}`} />
            <p>{passwordStrength.label}</p>
          </div>

          <button className="btn btn-gradient full" type="submit" disabled={submitting}>
            {submitting ? <LoaderCircle className="spin" size={16} /> : null}
            {submitting ? "Creating account..." : "Create Account"}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="auth-text-center">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
