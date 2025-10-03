import { IsUUID } from "class-validator";

export class MarkCourseDoneDto {
  @IsUUID()
  courseId: string;
}