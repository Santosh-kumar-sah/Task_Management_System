import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/apiResponse.utils";
import { HttpError } from "../utils/httpError";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction): Response {
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (err instanceof HttpError) {
    return errorResponse(res, err.message, err.statusCode, err.errors);
  }

  if (isDevelopment && err instanceof Error) {
    console.error(err.stack ?? err.message);
  }

  const message = err instanceof Error ? err.message : "Server error";
  return errorResponse(res, message, 500);
}
