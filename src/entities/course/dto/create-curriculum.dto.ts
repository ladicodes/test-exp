import { IsNotEmpty, IsString, IsEnum } from "class-validator";
import { CurriculumTitle } from "../course.entity";

export class CreateCurriculumDto {
  @IsEnum(CurriculumTitle)
  @IsNotEmpty()
  title: CurriculumTitle;

  @IsString()
  @IsNotEmpty()
  description: string;
}