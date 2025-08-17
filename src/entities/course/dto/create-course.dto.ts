import { IsNotEmpty, IsOptional, IsString, IsIn, IsUrl } from "class-validator";

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsIn(["draft", "published"])
  status?: "draft" | "published";
}
