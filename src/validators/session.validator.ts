import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { ResponseUtil } from "../utils/response";
import { SessionCategory } from "../entities/session/session.entity";

export const validateConfirmSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    confirmed: Joi.boolean().required(),
    cancellationReason: Joi.when("confirmed", {
      is: false,
      then: Joi.string().min(10).max(500).required(),
      otherwise: Joi.optional(),
    }),
    meetingLink: Joi.when("confirmed", {
      is: true,
      then: Joi.string().uri().optional(),
      otherwise: Joi.optional(),
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) return ResponseUtil.error(res, error.message, 400);

  return next();
};

export const validateUpdateSessionStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid("pending", "confirmed", "cancelled", "completed")
      .required(),
    cancellationReason: Joi.when("status", {
      is: "cancelled",
      then: Joi.string().min(10).max(500).required(),
      otherwise: Joi.optional(),
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) return ResponseUtil.error(res, error.message, 400);

  return next();
};