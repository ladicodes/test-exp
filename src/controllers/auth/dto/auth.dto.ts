import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}

export class ForgotPasswordDTO {
  @IsEmail()
  email: string;
}

export class ResetPasswordDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  newPassword: string;

  @IsString()
  otp: string;
}

export class VerifyOtpDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  otp: string;
}
