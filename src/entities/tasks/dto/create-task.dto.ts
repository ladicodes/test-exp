import {
  IsArray,
  IsDateString,
  IsEnum,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";
import { TaskPriority } from "../task.entity";

export class CreateTaskDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsUUID()
  assignedTo: string;

  @IsDateString()
  dueDate: Date;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
