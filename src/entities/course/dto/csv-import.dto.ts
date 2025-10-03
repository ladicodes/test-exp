import { IsNotEmpty, IsString, IsEnum, IsOptional, IsDateString, IsEmail } from "class-validator";
import { CurriculumTitle, LessonType } from "../course.entity";

export class CsvCurriculumDto {
  @IsEnum(CurriculumTitle)
  @IsNotEmpty()
  curriculumTitle: CurriculumTitle;

  @IsString()
  @IsNotEmpty()
  curriculumDescription: string;

  @IsString()
  @IsNotEmpty()
  courseTitle: string;

  @IsString()
  @IsNotEmpty()
  courseDescription: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsEnum(LessonType)
  @IsNotEmpty()
  lessonType: LessonType;

  @IsOptional()
  @IsEmail()
  instructorEmail?: string;
}