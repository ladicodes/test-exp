import { Request, Response } from "express";
import { AuthService } from "../../services/auth.service";
import { Repository } from "typeorm";
import { User } from "../../entities/user/user.entity";
import { CreateUserDTO } from "../../entities/user/dto/create-user.entity";
import { ResponseUtil } from "../../utils/response";
import { Otp } from "../../entities/auth/otp.entity";
import {
  ForgotPasswordDTO,
  LoginUserDTO,
  ResetPasswordDTO,
  VerifyOtpDTO,
} from "./dto/auth.dto";

export class AuthController {
  public readonly authService: AuthService;

  constructor(
      userRepository: Repository<User>,
      otpRepository: Repository<Otp>
  ) {
    this.authService = new AuthService(userRepository, otpRepository);
  }

  async updateUsersSerialNumber(
      req: Request,
      res: Response
  ): Promise<Response> {
    try {
      const result = await this.authService.updateUsersSerialNumber();
      return ResponseUtil.success(
          res,
          result,
          "Serial numbers updated successfully"
      );
    } catch (error) {
      return ResponseUtil.error(
          res,
          "Error updating serial numbers",
          500,
          error
      );
    }
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
      const isValidOtp = await this.authService.verifyOtp(
          email,
          otp,
          !!req.query?.isOther
      );
      if (!isValidOtp) return ResponseUtil.error(res, "Invalid OTP", 400);

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

  async login(req: Request, res: Response): Promise<Response> {
    const body: LoginUserDTO = req.body;

    try {
      const { data, error } = await this.authService.login(
          body.email,
          body.password
      );
      if (error) return ResponseUtil.error(res, error, 401);
      return ResponseUtil.success(res, data, "Login successful");
    } catch (error) {
      return ResponseUtil.error(res, "Login failed", 500, error);
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body as ForgotPasswordDTO;

    try {
      await this.authService.forgotPassword(email);
      return ResponseUtil.success(res, null, `OTP sent to ${email}`);
    } catch (error: any) {
      return ResponseUtil.error(
          res,
          error.message || "Failed to send OTP",
          500,
          error
      );
    }
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    const body: ResetPasswordDTO = req.body;

    try {
      const result = await this.authService.resetPassword(body);
      if (result.error) return ResponseUtil.error(res, result.error, 400);
      return ResponseUtil.success(
          res,
          result.data,
          "Password reset successful"
      );
    } catch (error: any) {
      return ResponseUtil.error(res, "Password reset failed", 500, error);
    }
  }
}