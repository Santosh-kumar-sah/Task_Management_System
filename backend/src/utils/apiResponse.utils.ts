import type { Response } from "express";

export interface ErrorDetail {
  path: string;
  message: string;
}

export interface ApiErrorPayload {
  success: false;
  message: string;
  errors?: unknown;
}

export interface ApiSuccessPayload<T> {
  success: true;
  data: T;
}

export function successResponse<T>(res: Response, data: T, statusCode: number = 200): Response<ApiSuccessPayload<T>> {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = 400,
  errors?: unknown
): Response<ApiErrorPayload> {
  const payload: ApiErrorPayload = {
    success: false,
    message,
  };

  if (errors !== undefined) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
}
