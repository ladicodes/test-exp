import { IsOptional, IsString, IsIn, IsUrl } from "class-validator";

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsIn(["draft", "published"])
  status?: "draft" | "published";
}
