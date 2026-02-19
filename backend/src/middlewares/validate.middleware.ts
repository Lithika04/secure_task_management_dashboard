import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

// Generic request-body validator for Zod schemas.
export const validateRequest =
  (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ message: "Invalid input" });
      return;
    }

    req.body = result.data;
    next();
  };
