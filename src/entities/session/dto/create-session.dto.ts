import { IsEnum, IsOptional, IsString } from "class-validator";
import { SessionCategory } from "../session.entity";

export class CreateSessionDto {
  @IsString()
  title: string;

  @IsEnum(SessionCategory)
  category: SessionCategory;

  @IsString()
  startTime: Date;

  @IsString()
  @IsOptional()
  endTime?: Date;

  @IsString()
  @IsOptional()
  description?: string;
}
