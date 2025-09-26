import { Request, Response } from "express";
import { ResponseUtil } from "../utils/response";
import logger from "../utils/logger";

export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error("Error:", {
    message: err.message,
    stack: err.stack,
    statusCode,
    url: req.url,
    method: req.method,
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === "development";

  return ResponseUtil.error(
    res,
    message,
    statusCode,
    isDevelopment ? err.stack : undefined
  );
};
