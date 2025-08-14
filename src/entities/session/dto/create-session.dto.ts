import { SessionCategory } from "../session.entity";

export class CreateSessionDto {
  title: string;
  category: SessionCategory;
  startTime: Date;
  endTime?: Date;
  description?: string;
}
