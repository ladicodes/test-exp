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
  token: string;
}
