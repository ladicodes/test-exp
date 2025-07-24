import { Request, Response } from "express";
import { AuthService } from "../../services/auth.service";
import { Repository } from "typeorm";
import { User } from "../../entities/user/user.entity";
import { CreateUserDTO } from "../../entities/user/dto/create-user.entity";
import { ResponseUtil } from "../../utils/response";
import { Otp } from "../../entities/auth/otp.entity";
import { VerifyOtpDTO } from "./dto/auth.dto";

export class AuthController {
  public readonly authService: AuthService;

  constructor(
    userRepository: Repository<User>,
    otpRepository: Repository<Otp>
  ) {
    this.authService = new AuthService(userRepository, otpRepository);
  }

  async register(req: Request, res: Response): Promise<Response> {
    const userData = req.body as CreateUserDTO;

    try {
      const newUser = await this.authService.register(userData);
      return ResponseUtil.success(res, newUser, "User registered successfully");
    } catch (error: any) {
      return ResponseUtil.error(
        res,
        error.message || "Registration failed",
        401,
        error
      );
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<Response> {
    const data: VerifyOtpDTO = req.body;
    const { email, otp } = data;

    try {
      const isValidOtp = await this.authService.verifyOtp(email, otp);
      if (!isValidOtp) {
        return ResponseUtil.error(res, "Invalid OTP", 400);
      }
      return ResponseUtil.success(res, null, "OTP verified successfully");
    } catch (error: any) {
      return ResponseUtil.error(
        res,
        error.message || "OTP verification failed",
        500,
        error
      );
    }
  }

  // async login(req: Request, res: Response): Promise<Response> {
  //   const body: LoginUserDTO = req.body;

  //   try {
  //     const user = await this.authService.login(body.email, body.password);
  //     if (!user) {
  //       return ResponseUtil.error(res, "Invalid credentials", 401);
  //     }
  //     return ResponseUtil.success(res, user, "Login successful");
  //   } catch (error) {
  //     return ResponseUtil.error(res, "Login failed", 500, error);
  //   }
  // }
}
