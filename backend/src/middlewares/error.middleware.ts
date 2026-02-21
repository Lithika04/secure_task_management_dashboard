import { NextFunction, Request, Response } from "express";

type HttpError = Error & { status?: number };

// Handles unmatched routes in a single place.
export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ message: "Route not found" });
};

// Centralized error responder to avoid leaking internal details.
export const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Keep full stack/details in server logs, not API responses.
  console.error(err);

  res.status(err.status || 500).json({
    message: "Internal Server Error",
  });
};
