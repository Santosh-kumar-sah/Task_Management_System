import type { Request, Response } from "express";
import { successResponse } from "../../utils/apiResponse.utils";
import type { CreateTaskInput, TaskIdParam, UpdateTaskInput } from "./tasks.schema";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "./tasks.service";

export async function listTasksController(req: Request, res: Response): Promise<Response> {
  const user = req.user as Express.UserPayload;
  const tasks = await listTasks(user);
  return successResponse(res, tasks, 200);
}

export async function getTaskController(req: Request, res: Response): Promise<Response> {
  const user = req.user as Express.UserPayload;
  const params = req.params as unknown as TaskIdParam;
  const task = await getTask(params.id, user);
  return successResponse(res, task, 200);
}

export async function createTaskController(req: Request, res: Response): Promise<Response> {
  const user = req.user as Express.UserPayload;
  const payload = req.body as CreateTaskInput;
  const task = await createTask(user, payload);
  return successResponse(res, task, 201);
}

export async function updateTaskController(req: Request, res: Response): Promise<Response> {
  const user = req.user as Express.UserPayload;
  const params = req.params as unknown as TaskIdParam;
  const payload = req.body as UpdateTaskInput;
  const task = await updateTask(params.id, user, payload);
  return successResponse(res, task, 200);
}

export async function deleteTaskController(req: Request, res: Response): Promise<Response> {
  const user = req.user as Express.UserPayload;
  const params = req.params as unknown as TaskIdParam;
  const result = await deleteTask(params.id, user);
  return successResponse(res, result, 200);
}
