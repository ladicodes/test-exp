import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { ResponseUtil } from "../utils/response";
import {UserRole} from "../entities/user/user.entity";




export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
}

const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  return parts[1];
};

const verifyToken = (token: string): JWTPayload | null => {
  try {
    // jwt.verify both verifies and decodes the token
    const payload = jwt.verify(token, config.jwt.secret) as JWTPayload;

    if (!payload || typeof payload !== "object" || !payload.id) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
};


export const authenticateAndAuthorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = extractToken(req.headers.authorization);
    if (!token) {
      return ResponseUtil.error(res, "Unauthorized", 401);
    }

    const payload = verifyToken(token);
    if (!payload) {
      return ResponseUtil.error(res, "Unauthorized", 401);
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
      return ResponseUtil.error(res, "Forbidden", 403);
    }

    const user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
    // @ts-ignore
    req.user = user;
    return next();
  };
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = extractToken(req.headers.authorization);
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

export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = extractToken(req.headers.authorization);
  if (!token) return ResponseUtil.error(res, "Unauthorized", 401);

  const isValid = jwt.verify(token, config.jwt.secret);

  if (!isValid) return ResponseUtil.error(res, "Unauthorized", 401);

  const payload = jwt.decode(token, config.jwt.secret) as any;

  if (payload.role !== "admin")
    return ResponseUtil.error(res, "Unauthorized", 401);

  const user = {
    id: payload.id,
    email: payload.email,
    role: payload.role,
  };

  // @ts-ignore
  req.user = user;

  next();
};

export const instructorAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = extractToken(req.headers.authorization);
  if (!token) return ResponseUtil.error(res, "Unauthorized", 401);

  const isValid = jwt.verify(token, config.jwt.secret);

  if (!isValid) return ResponseUtil.error(res, "Unauthorized", 401);

  const payload = jwt.decode(token, config.jwt.secret) as any;

  if (payload.role !== "instructor")
    return ResponseUtil.error(res, "Unauthorized", 401);

  const user = {
    id: payload.id,
    email: payload.email,
    role: payload.role,
  };

  // @ts-ignore
  req.user = user;

  next();
};
