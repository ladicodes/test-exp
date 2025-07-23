import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "../user.entity";

export class UpdateUserDTO {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  school?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
