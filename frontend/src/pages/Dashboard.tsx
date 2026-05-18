import { CheckCircle2, ClipboardList, Clock3, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import api from "../api/axios";
import { DeleteDialog } from "../components/DeleteDialog";
import { SearchBar } from "../components/SearchBar";
import { SkeletonCard } from "../components/SkeletonCard";
import { StatCard } from "../components/StatCard";
import { TaskCard, type TaskItem } from "../components/TaskCard";
import { TaskModal, type TaskFormValues, type TaskStatus } from "../components/TaskModal";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";

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
  const { user } = useAuth();
  const { addToast } = useToast();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | TaskStatus>("ALL");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState<"create" | "edit">("create");
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<TaskItem | null>(null);
  const [removingTaskId, setRemovingTaskId] = useState<number | null>(null);

  const loadTasks = async (): Promise<void> => {
    if (tasks.length === 0) {
      setInitialLoading(true);
    }

    setLoading(true);
    setPageError(null);

    try {
      const response = await api.get<ApiSuccessResponse<TaskItem[]>>("/api/v1/tasks");
      setTasks(response.data.data);
    } catch (error: unknown) {
      setPageError(extractMessage(error));
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    void loadTasks();
  }, []);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "DONE").length;
    const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS").length;

    return {
      total: tasks.length,
      completed,
      inProgress,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchesFilter = statusFilter === "ALL" ? true : task.status === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, statusFilter, tasks]);

  const openCreateModal = (): void => {
    setTaskModalMode("create");
    setEditingTask(null);
    setModalError(null);
    setTaskModalOpen(true);
  };

  const openEditModal = (task: TaskItem): void => {
    setTaskModalMode("edit");
    setEditingTask(task);
    setModalError(null);
    setTaskModalOpen(true);
  };

  const openDeleteDialog = (task: TaskItem): void => {
    setDeletingTask(task);
    setDeleteDialogOpen(true);
  };

  const closeTaskModal = (): void => {
    if (!busy) {
      setTaskModalOpen(false);
      setEditingTask(null);
      setModalError(null);
    }
  };

  const closeDeleteDialog = (): void => {
    if (!busy) {
      setDeleteDialogOpen(false);
      setDeletingTask(null);
    }
  };

  const submitTask = async (values: TaskFormValues): Promise<void> => {
    setBusy(true);
    setModalError(null);

    try {
      if (taskModalMode === "create") {
        await api.post<ApiSuccessResponse<TaskItem>>("/api/v1/tasks", values);
        addToast("success", "Task created successfully.");
      } else if (editingTask) {
        await api.patch<ApiSuccessResponse<TaskItem>>(`/api/v1/tasks/${editingTask.id}`, values);
        addToast("success", "Task updated successfully.");
      }

      closeTaskModal();
      await loadTasks();
    } catch (error: unknown) {
      const message = extractMessage(error);
      setModalError(message);
      addToast("error", message);
    } finally {
      setBusy(false);
    }
  };

  const confirmDeleteTask = async (): Promise<void> => {
    if (!deletingTask) {
      return;
    }

    setBusy(true);
    setRemovingTaskId(deletingTask.id);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 240);
    });

    try {
      await api.delete<ApiSuccessResponse<{ id: number; message: string }>>(`/api/v1/tasks/${deletingTask.id}`);
      addToast("success", "Task deleted successfully.");
      closeDeleteDialog();
      await loadTasks();
    } catch (error: unknown) {
      addToast("error", extractMessage(error));
    } finally {
      setBusy(false);
      setRemovingTaskId(null);
    }
  };

  return (
    <section className="dashboard-page">
      {initialLoading ? (
        <div className="full-loader" aria-label="Loading dashboard">
          <span className="loader-ring" />
        </div>
      ) : null}

      <div className="hero-stats">
        <StatCard label="Total Tasks" value={stats.total} icon={ClipboardList} />
        <StatCard label="Completed Tasks" value={stats.completed} icon={CheckCircle2} />
        <StatCard label="In Progress" value={stats.inProgress} icon={Clock3} />
      </div>

      <section className="task-board">
        <header className="task-board-head">
          <div>
            <h2>My Tasks</h2>
            <span className="count-badge">{filteredTasks.length}</span>
          </div>

          <div className="task-controls">
            <SearchBar value={searchTerm} onChange={setSearchTerm} disabled={busy} />

            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "ALL" | TaskStatus)}>
              <option value="ALL">All</option>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>

            <button className="btn btn-accent" type="button" onClick={openCreateModal} disabled={busy}>
              <Plus size={16} />
              New Task
            </button>
          </div>
        </header>

        {pageError ? <div className="form-banner error">⚠ {pageError}</div> : null}

        {loading ? (
          <div className="task-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
          </div>
        ) : null}

        {!loading && filteredTasks.length === 0 ? (
          <div className="empty-illustration">
            <ClipboardList size={56} />
            <h3>No tasks yet</h3>
            <p>Click '+ New Task' to get started</p>
            <button type="button" className="btn btn-accent" onClick={openCreateModal}>
              <Plus size={16} />
              New Task
            </button>
          </div>
        ) : null}

        {!loading && filteredTasks.length > 0 ? (
          <div className="task-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isAdminView={user?.role === "ADMIN"}
                isRemoving={removingTaskId === task.id}
                onEdit={openEditModal}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>
        ) : null}
      </section>

      <TaskModal
        isOpen={taskModalOpen}
        mode={taskModalMode}
        initialValues={
          editingTask
            ? {
                title: editingTask.title,
                description: editingTask.description ?? "",
                status: editingTask.status,
              }
            : undefined
        }
        loading={busy}
        error={modalError}
        onClose={closeTaskModal}
        onSubmit={submitTask}
      />

      <DeleteDialog isOpen={deleteDialogOpen} loading={busy} onCancel={closeDeleteDialog} onConfirm={confirmDeleteTask} />
    </section>
  );
}
