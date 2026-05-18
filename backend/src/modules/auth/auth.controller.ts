import type { Request, Response } from "express";
import { successResponse } from "../../utils/apiResponse.utils";
import type { LoginInput, RegisterInput } from "./auth.schema";
import { loginUser, registerUser } from "./auth.service";

export async function registerController(req: Request, res: Response): Promise<Response> {
  const payload = req.body as RegisterInput;
  const result = await registerUser(payload);
  return successResponse(res, result, 201);
}

export async function loginController(req: Request, res: Response): Promise<Response> {
  const payload = req.body as LoginInput;
  const result = await loginUser(payload);
  return successResponse(res, result, 200);
}
