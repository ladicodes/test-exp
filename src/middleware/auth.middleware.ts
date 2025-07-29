import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { ResponseUtil } from "../utils/response";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // extract token from headers
  const [type, token] = req.headers.authorization?.split(" ") || [];

  if (!type || type !== "Bearer")
    return ResponseUtil.error(res, "Unauthorized", 401);

  if (!token) return ResponseUtil.error(res, "Unauthorized", 401);

  const isValid = jwt.verify(token, config.jwt.secret);

  if (!isValid) return ResponseUtil.error(res, "Unauthorized", 401);

  const payload = jwt.decode(token, config.jwt.secret) as any;

  if (!payload || typeof payload !== "object" || !payload.id)
    return ResponseUtil.error(res, "Unauthorized", 401);

  const user = {
    id: payload.id,
    email: payload.email,
    role: payload.role,
  };

  // @ts-ignore
  req.user = user;

  return next();
};
