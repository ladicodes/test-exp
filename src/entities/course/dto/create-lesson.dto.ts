import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsInt,
  Min,
} from "class-validator";

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
