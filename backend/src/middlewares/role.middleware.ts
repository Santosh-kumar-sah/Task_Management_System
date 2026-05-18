import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/apiResponse.utils";

type AllowedRole = "user" | "admin";

function normalizeRole(role: AllowedRole): string {
  return role.toUpperCase();
}

export function requireRole(role: AllowedRole) {
  return function roleGuard(req: Request, res: Response, next: NextFunction): Response | void {
    if (!req.user) {
      return errorResponse(res, "Unauthorized", 401);
    }

    if (req.user.role !== normalizeRole(role)) {
      return errorResponse(res, "Forbidden: insufficient permissions", 403);
    }

    return next();
  };
}
