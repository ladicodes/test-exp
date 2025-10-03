import { IsNotEmpty, IsOptional, IsString, IsUrl, IsDateString, IsEnum, IsUUID } from "class-validator";
import { LessonType } from "../course.entity";

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsEnum(LessonType)
  @IsNotEmpty()
  lessonType: LessonType;

  @IsOptional()
  @IsUUID()
  instructorId?: string;

  @IsUUID()
  @IsNotEmpty()
  curriculumId: string;
}
