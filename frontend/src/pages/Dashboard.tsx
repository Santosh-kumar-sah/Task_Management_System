import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { TaskCard, type TaskItem } from "../components/TaskCard";
import { TaskForm, type TaskFormValues } from "../components/TaskForm";

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface ApiErrorResponse {
  message?: string;
}

function extractMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const apiMessage = error.response?.data.message;

    if (typeof apiMessage === "string" && apiMessage.length > 0) {
      return apiMessage;
    }
  }

  return error instanceof Error ? error.message : "Unexpected error";
}

export function Dashboard(): JSX.Element {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadTasks = async (): Promise<void> => {
    setLoading(true);
    setPageError(null);

    try {
      const response = await api.get<ApiSuccessResponse<TaskItem[]>>("/api/v1/tasks");
      setTasks(response.data.data);
    } catch (error: unknown) {
      setPageError(extractMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTasks();
  }, []);

  useEffect(() => {
    if (!banner) {
      return;
    }

    const timer = window.setTimeout(() => setBanner(null), 3200);
    return () => window.clearTimeout(timer);
  }, [banner]);

  const createTask = async (values: TaskFormValues): Promise<void> => {
    await api.post<ApiSuccessResponse<TaskItem>>("/api/v1/tasks", values);
    setBanner({ type: "success", message: "Task created successfully." });
    setShowCreateForm(false);
    await loadTasks();
  };

  const updateTask = async (taskId: number, values: TaskFormValues): Promise<void> => {
    await api.patch<ApiSuccessResponse<TaskItem>>(`/api/v1/tasks/${taskId}`, values);
    setBanner({ type: "success", message: "Task updated successfully." });
    await loadTasks();
  };

  const deleteTask = async (taskId: number): Promise<void> => {
    try {
      await api.delete<ApiSuccessResponse<{ id: number; message: string }>>(`/api/v1/tasks/${taskId}`);
      setBanner({ type: "success", message: "Task deleted successfully." });
      await loadTasks();
    } catch (error: unknown) {
      setBanner({ type: "error", message: extractMessage(error) });
    }
  };

  const handleLogout = (): void => {
    logout();
    navigate("/login");
  };

  return (
    <main className="app-shell">
      <div className="page-shell">
        <header className="hero-header">
          <div>
            <div className="brand-mark">
              <span className="brand-badge">RA</span>
              Secure Task Platform
            </div>
            <h1 className="page-title">Task dashboard</h1>
            <p className="page-subtitle">Create, edit, and delete tasks with role-aware access control.</p>
          </div>

          <div className="toolbar-group">
            {user ? <span className="role-badge">{user.role}</span> : null}
            <button className="button button-secondary" type="button" onClick={() => setShowCreateForm(true)}>
              New Task
            </button>
            <button className="button button-danger" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {banner ? <div className={`banner ${banner.type}`}>{banner.message}</div> : null}

        <section className="dashboard-card surface">
          {showCreateForm ? (
            <div className="inline-form" style={{ marginBottom: "1rem" }}>
              <TaskForm
                submitLabel="Create task"
                onSubmit={createTask}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          ) : null}

          {loading ? <p className="helper-text">Loading tasks...</p> : null}
          {pageError ? <div className="error-text">{pageError}</div> : null}

          {!loading && !pageError && tasks.length === 0 ? (
            <div className="empty-state">No tasks yet. Create the first one to begin tracking work.</div>
          ) : null}

          {!loading && tasks.length > 0 ? (
            <div className="task-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isAdminView={user?.role === "ADMIN"}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
