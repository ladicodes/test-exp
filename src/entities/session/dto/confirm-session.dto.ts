export interface ConfirmSessionDto {
  sessionId: string;
  confirmed: boolean;
  cancellationReason?: string;
  meetingLink?: string;
}

export interface UpdateSessionStatusDto {
  status: "pending" | "confirmed" | "cancelled" | "completed";
  cancellationReason?: string;
}