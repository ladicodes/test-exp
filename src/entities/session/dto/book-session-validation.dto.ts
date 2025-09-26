import { IsNotEmpty, IsString, IsDateString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { SessionCategory } from '../session.entity';

export class BookSessionDto {
  @IsNotEmpty()
  @IsUUID()
  mentorId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(SessionCategory)
  category: SessionCategory;

  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsString()
  description?: string;
}