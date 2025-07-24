import express from "express";
import { AppDataSource } from "../../../utils/data-source";
import { User } from "../../../entities/user/user.entity";
import { AuthController } from "../../../controllers/auth/auth.controller";
import { validateBody } from "../../../middleware/validate.middleware";
import { CreateUserDTO } from "../../../entities/user/dto/create-user.entity";
import { Otp } from "../../../entities/auth/otp.entity";

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

// router.post(
//   "/login",
//   validateBody(LoginUserDTO),
//   authController.login.bind(authController)
// );

export default router;
