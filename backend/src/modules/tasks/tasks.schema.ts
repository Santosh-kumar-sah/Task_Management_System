import { z } from "zod";

export const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const taskIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Task id must be a positive integer"),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Title must be 120 characters or less"),
  description: z.string().trim().max(1000, "Description must be 1000 characters or less").optional(),
  status: taskStatusSchema.default("TODO"),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Title must be 120 characters or less").optional(),
  description: z.string().trim().max(1000, "Description must be 1000 characters or less").optional(),
  status: taskStatusSchema.optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdParam = z.infer<typeof taskIdParamSchema>;
