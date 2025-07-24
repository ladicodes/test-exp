import { Repository } from "typeorm";
import { CreateUserDTO } from "../entities/user/dto/create-user.entity";
import { User } from "../entities/user/user.entity";
import bcrypt from "bcryptjs";
import { emailService, EmailService } from "./email.service";
import { Otp } from "../entities/auth/otp.entity";
import { format } from "date-fns";

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

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const otpRecord = await this.otpRepository.findOne({
      where: { email, otp },
    });

    if (!otpRecord) throw new Error("Invalid OTP");

    await this.otpRepository.delete(otpRecord.id);

    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new Error("User not found");

    user.isVerified = true;
    await this.userRepository.save(user);

    await emailService.sendWelcomeEmail(email, {
      name: user.firstName,
      email: user.email,
    });

    return true;
  }

  async login(email: string, password: string) {}

  async logout(userId: string) {}

  async sendOtpEmail(body: CreateUserDTO) {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await emailService
      .sendEmailConfirmation(body.email, {
        name: body.firstName,
        email: body.email,
        otp,
        // 24 hours expiration time
        expirationTime: format(
          new Date(Date.now() + 24 * 60 * 60 * 1000),
          "yyyy-MM-dd HH:mm:ss"
        ),
      })
      .then(async () => {
        await this.otpRepository.save({ email: body.email, otp });
      });

    return otp;
  }
}
