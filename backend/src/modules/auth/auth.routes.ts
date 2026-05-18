import { Router } from "express";
import { loginController, registerController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.schema";
import { validate } from "../../middlewares/validate.middleware";

const authRouter = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Creates a new user account and returns a JWT access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation or duplicate email error
 */
authRouter.post("/register", validate(registerSchema), registerController);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login an existing user
 *     description: Validates credentials and returns a JWT access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
authRouter.post("/login", validate(loginSchema), loginController);

export default authRouter;
