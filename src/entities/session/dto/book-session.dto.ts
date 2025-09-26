import { SessionCategory } from "../session.entity";

export interface BookSessionDto {
  mentorId: string;
  title: string;
  category: SessionCategory;
  startTime: string | Date;
  endTime?: string | Date;
  description?: string;
}