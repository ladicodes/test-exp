import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { ResponseUtil } from "../utils/response";

export const validateGetTasksQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({}).optional();

  const { error } = schema.validate(req.query);

  if (error) return ResponseUtil.error(res, error.message, 400);

  return next();
};
