import { Prisma, type TaskStatus } from "@prisma/client";
import { prisma } from "../../config/db";
import { HttpError } from "../../utils/httpError";
import type { CreateTaskInput, UpdateTaskInput } from "./tasks.schema";

const taskSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TaskSelect;

export type TaskRecord = Prisma.TaskGetPayload<{ select: typeof taskSelect }>;

async function getTaskOrThrow(taskId: number): Promise<TaskRecord> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: taskSelect,
  });

  if (!task) {
    throw new HttpError("Task not found", 404);
  }

  return task;
}

function assertTaskAccess(task: TaskRecord, currentUserId: number, currentUserRole: string): void {
  if (currentUserRole === "ADMIN") {
    return;
  }

  if (task.userId !== currentUserId) {
    throw new HttpError("You do not have permission to access this task", 403);
  }
}

export async function listTasks(user: Express.UserPayload): Promise<TaskRecord[]> {
  const whereClause = user.role === "ADMIN" ? {} : { userId: user.id };

  return prisma.task.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    select: taskSelect,
  });
}

export async function getTask(taskId: number, user: Express.UserPayload): Promise<TaskRecord> {
  const task = await getTaskOrThrow(taskId);
  assertTaskAccess(task, user.id, user.role);
  return task;
}

export async function createTask(user: Express.UserPayload, input: CreateTaskInput): Promise<TaskRecord> {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status as TaskStatus,
      userId: user.id,
    },
    select: taskSelect,
  });
}

export async function updateTask(taskId: number, user: Express.UserPayload, input: UpdateTaskInput): Promise<TaskRecord> {
  const task = await getTaskOrThrow(taskId);
  assertTaskAccess(task, user.id, user.role);

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.status !== undefined ? { status: input.status as TaskStatus } : {}),
    },
    select: taskSelect,
  });
}

export async function deleteTask(taskId: number, user: Express.UserPayload): Promise<{ id: number; message: string }> {
  const task = await getTaskOrThrow(taskId);
  assertTaskAccess(task, user.id, user.role);

  await prisma.task.delete({ where: { id: taskId } });
  return {
    id: taskId,
    message: "Task deleted successfully",
  };
}
