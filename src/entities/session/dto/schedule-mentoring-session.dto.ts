export interface ScheduleMentoringSessionDto {
  title: string;
  category: string;
  startTime: Date;
  endTime?: Date;
  description?: string;
  agenda?: string;
  mentorId: string;
  meetingLink?: string;
}