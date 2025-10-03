import { IsOptional, IsString, IsEnum } from "class-validator";
import { CurriculumTitle } from "../course.entity";

export class UpdateCurriculumDto {
  @IsEnum(CurriculumTitle)
  @IsOptional()
  title?: CurriculumTitle;

  @IsString()
  @IsOptional()
  description?: string;
}