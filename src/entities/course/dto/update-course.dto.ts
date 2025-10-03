import { IsOptional, IsString, IsUrl, IsDateString, IsEnum, IsUUID } from "class-validator";
import { LessonType } from "../course.entity";

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsOptional()
  @IsEnum(LessonType)
  lessonType?: LessonType;

  @IsOptional()
  @IsUUID()
  instructorId?: string | null;

  @IsOptional()
  @IsUUID()
  curriculumId?: string;
}
