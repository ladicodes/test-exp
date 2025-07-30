import express from "express";
import { AppDataSource } from "../../../utils/data-source";
import { User } from "../../../entities/user/user.entity";
import { AuthController } from "../../../controllers/auth/auth.controller";
import { validateBody } from "../../../middleware/validate.middleware";
import { CreateUserDTO } from "../../../entities/user/dto/create-user.entity";
import { Otp } from "../../../entities/auth/otp.entity";
import {
  ForgotPasswordDTO,
  LoginUserDTO,
  ResetPasswordDTO,
  VerifyOtpDTO,
} from "../../../controllers/auth/dto/auth.dto";
import { authMiddleware } from "../../../middleware/auth.middleware";

const [userRepository, otpRepository] = [
  AppDataSource.getRepository(User),
  AppDataSource.getRepository(Otp),
];
const authController = new AuthController(userRepository, otpRepository);

const router = express.Router();

router.post(
  "/register",
  validateBody(CreateUserDTO),
  authController.register.bind(authController)
);

router.post(
  "/verify-otp",
  validateBody(VerifyOtpDTO),
  authController.verifyOtp.bind(authController)
);

router.post(
  "/login",
  validateBody(LoginUserDTO),
  authController.login.bind(authController)
);

router.post(
  "/forgot-password",
  validateBody(ForgotPasswordDTO),
  authController.forgotPassword.bind(authController)
);

router.post(
  "/reset-password",
  validateBody(ResetPasswordDTO),
  authController.resetPassword.bind(authController)
);

export default router;
