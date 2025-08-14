import { SessionCategory } from "../session.entity";

export class UpdateSessionDto {
  title?: string;
  category?: SessionCategory;
  startTime?: Date;
  endTime?: Date;
  description?: string;
}
