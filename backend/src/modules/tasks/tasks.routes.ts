import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  createTaskController,
  deleteTaskController,
  getTaskController,
  listTasksController,
  updateTaskController,
} from "./tasks.controller";
import { createTaskSchema, taskIdParamSchema, updateTaskSchema } from "./tasks.schema";

const tasksRouter = Router();

tasksRouter.use(authMiddleware);

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: List tasks
 *     description: Returns the authenticated user's tasks, or all tasks for admins.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks returned successfully
 *       401:
 *         description: Missing or invalid token
 */
tasksRouter.get("/", listTasksController);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get a single task
 *     description: Returns a single task if the caller is the owner or an admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Task returned successfully
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 */
tasksRouter.get("/:id", validate(taskIdParamSchema, "params"), getTaskController);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create a task
 *     description: Creates a task for the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Finish assignment
 *               description:
 *                 type: string
 *                 example: Complete the API with auth and RBAC
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *                 example: TODO
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid token
 */
tasksRouter.post("/", validate(createTaskSchema), createTaskController);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Update a task
 *     description: Updates a task if the caller is the owner or an admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated task title
 *               description:
 *                 type: string
 *                 example: Updated description
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *                 example: IN_PROGRESS
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 */
tasksRouter.patch("/:id", validate(taskIdParamSchema, "params"), validate(updateTaskSchema), updateTaskController);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete a task
 *     description: Deletes a task if the caller is the owner or an admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 */
tasksRouter.delete("/:id", validate(taskIdParamSchema, "params"), deleteTaskController);

export default tasksRouter;
