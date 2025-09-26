import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";
import { TaskPriority, TaskStatus } from "../task.entity";

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

export class UpdateTaskDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  title: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority: TaskPriority;

  @IsUUID()
  @IsOptional()
  assignedTo: string;

  @IsDateString()
  @IsOptional()
  dueDate: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];

  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;
}
