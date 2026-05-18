import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/apiResponse.utils";
import { verifyToken } from "../utils/jwt.utils";

export function authMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader?.startsWith("Bearer ")) {
      return errorResponse(res, "Authorization token is required", 401);
    }

    const token = authorizationHeader.slice(7).trim();
    const decoded = verifyToken(token);
    req.user = decoded.user;
    return next();
  } catch {
    return errorResponse(res, "Invalid or expired token", 401);
  }
}
