import { Repository } from "typeorm";
import { CreateUserDTO } from "../entities/user/dto/create-user.entity";
import { User } from "../entities/user/user.entity";
import bcrypt from "bcryptjs";
import { emailService } from "./email.service";
import { Otp } from "../entities/auth/otp.entity";
import { format } from "date-fns";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { config } from "../config";
import ms from "ms";
import { ResetPasswordDTO } from "../controllers/auth/dto/auth.dto";

export class AuthService {
  private readonly userRepository: Repository<User>;
  private readonly otpRepository: Repository<Otp>;

  constructor(
    userRepository: Repository<User>,
    otpRepository: Repository<Otp>
  ) {
    this.userRepository = userRepository;
    this.otpRepository = otpRepository;
  }

  async register(body: CreateUserDTO) {
    const existingUser = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (existingUser) throw new Error("User already exists");

    const data = { ...body };

    data.password = await bcrypt.hash(body.password, 10);

    await this.sendOtpEmail(body);

    const newUser = this.userRepository.create(data);
    return this.userRepository.save(newUser);
  }

  async verifyOtp(
    email: string,
    otp: string,
    isOther = false
  ): Promise<boolean> {
    const otpRecord = await this.otpRepository.findOne({
      where: { email, otp },
    });

    if (!otpRecord) throw new Error("Invalid OTP");

    await this.otpRepository.delete(otpRecord.id);

    if (!isOther) {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) throw new Error("User not found");

      user.isVerified = true;
      await this.userRepository.save(user);

      await emailService.sendWelcomeEmail(email, {
        name: user.firstName,
        email: user.email,
      });
    }

    return true;
  }

  async login(
    email: string,
    password: string
  ): Promise<{ error?: string; data?: any }> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) return { error: "User not found" };

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return { error: "Invalid password" };

    if (!user.isVerified) return { error: "User not verified" };

    const { password: _, ...userData } = user;

    const payload = userData;

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    return {
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          school: user.school,
          profilePicture: user.profilePicture,
          bio: user.bio,
          github: user.github,
          linkedin: user.linkedin,
          twitter: user.twitter,
          website: user.website,
          dateOfBirth: user.dateOfBirth,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: Date.now() + ms(config.jwt.expiresIn),
        },
      },
    };
  }

  async logout(userId: string) {}

  async refreshToken(req: Request) {}

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) throw new Error("User not found");

    const otp = this.generateOtp(6);
    const expiresAt = new Date(ms("24h"));

    await emailService
      .sendPasswordResetEmail(email, {
        name: user.firstName,
        otp,
      })
      .then(async () => {
        await this.otpRepository.save({ email, otp, expiresAt });
      });

    return otp;
  }

  async resetPassword(
    body: ResetPasswordDTO
  ): Promise<{ error?: string; data?: string }> {
    const { email, otp, newPassword } = body;

    // const otpRecord = await this.otpRepository.findOne({
    //   where: { email, otp },
    // });

    // if (!otpRecord) return { error: "Invalid OTP" };

    // if (new Date() > otpRecord.expiresAt) {
    //   await this.otpRepository.delete(otpRecord.id);
    //   return { error: "OTP expired" };
    // }

    const user = await this.userRepository.findOneBy({ email });
    if (!user) return { error: "User not found" };

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    // await this.otpRepository.delete(otpRecord.id);

    return { data: "Password reset successfully" };
  }

  async sendOtpEmail(body: CreateUserDTO) {
    // Generate OTP
    const otp = this.generateOtp(6);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await emailService
      .sendEmailConfirmation(body.email, {
        name: body.firstName,
        email: body.email,
        otp,
        // 24 hours expiration time
        expirationTime: format(expiresAt, "yyyy-MM-dd HH:mm:ss"),
      })
      .then(async () => {
        await this.otpRepository.save({ email: body.email, otp, expiresAt });
      });

    return otp;
  }

  generateOtp(length: number): string {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }
}
