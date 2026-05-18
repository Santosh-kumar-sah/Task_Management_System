import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodTypeAny } from "zod";
import { errorResponse } from "../utils/apiResponse.utils";

type ValidationSource = "body" | "params" | "query";

export function validate(schema: ZodTypeAny, source: ValidationSource = "body"): RequestHandler {
  return function validationMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
    const rawValue = req[source];
    const result = schema.safeParse(rawValue);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        path: issue.path.length > 0 ? issue.path.join(".") : source,
        message: issue.message,
      }));

      return errorResponse(res, "Validation failed", 400, errors);
    }

    if (source === "body") {
      req.body = result.data as Request["body"];
    }

    if (source === "params") {
      req.params = result.data as Request["params"];
    }

    if (source === "query") {
      req.query = result.data as Request["query"];
    }

    return next();
  };
}
