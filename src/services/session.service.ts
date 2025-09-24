import { Repository } from "typeorm";
import { isBefore } from "date-fns";
import { Session, SessionType, SessionStatus } from "../entities/session/session.entity";
import { User } from "../entities/user/user.entity";
import { CreateSessionDto } from "../entities/session/dto/create-session.dto";
import { UpdateSessionDto } from "../entities/session/dto/update-session.dto";
import { ScheduleMentoringSessionDto } from "../entities/session/dto/schedule-mentoring-session.dto";
import { ConfirmSessionDto } from "../entities/session/dto/confirm-session.dto";
import { emailService } from "./email.service";
import { config } from "../config/environment";

export class SessionService {
  private readonly sessionRepository: Repository<Session>;
  private readonly userRepository: Repository<User>;

  constructor(
    sessionRepository: Repository<Session>,
    userRepository: Repository<User>
  ) {
    this.sessionRepository = sessionRepository;
    this.userRepository = userRepository;
  }

  async createSession({ body, user }: { user: User; body: CreateSessionDto }) {
    if (isBefore(new Date(body.startTime), new Date())) {
      throw new Error("Start time cannot be in the past.");
    }

    if (
      body.endTime &&
      isBefore(new Date(body.endTime), new Date(body.startTime))
    ) {
      throw new Error("End time cannot be before start time.");
    }

    const newSession = this.sessionRepository.create({
      ...body,
      user,
    });

    return await this.sessionRepository.save(newSession);
  }

  async getAllSessions(userId?: string) {
    const query = this.sessionRepository
      .createQueryBuilder("session")
      .leftJoinAndSelect("session.user", "user")
      .orderBy("session.startTime", "ASC");

    if (userId) {
      query.where("user.id = :userId", { userId });
    }

    return await query.getMany();
  }

  async getSessionById(sessionId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ["user"],
    });
    if (!session) throw new Error("Session not found.");
    return session;
  }

  async updateSession(sessionId: string, body: UpdateSessionDto) {
    const session = await this.getSessionById(sessionId);

    if (body.startTime && isBefore(new Date(body.startTime), new Date())) {
      throw new Error("Start time cannot be in the past.");
    }

    if (
      body.endTime &&
      body.startTime &&
      isBefore(new Date(body.endTime), new Date(body.startTime))
    ) {
      throw new Error("End time cannot be before start time.");
    }

    Object.assign(session, body);
    return await this.sessionRepository.save(session);
  }

  async deleteSession(sessionId: string) {
    const session = await this.getSessionById(sessionId);
    await this.sessionRepository.remove(session);
    return { message: "Session deleted successfully" };
  }

  async scheduleMentoringSession({ 
    body, 
    user 
  }: { 
    user: User; 
    body: ScheduleMentoringSessionDto 
  }) {
    // Validate time constraints
    if (isBefore(new Date(body.startTime), new Date())) {
      throw new Error("Start time cannot be in the past.");
    }

    if (
      body.endTime &&
      isBefore(new Date(body.endTime), new Date(body.startTime))
    ) {
      throw new Error("End time cannot be before start time.");
    }

    // Find the mentor
    const mentor = await this.userRepository.findOne({
      where: { id: body.mentorId }
    });

    if (!mentor) {
      throw new Error("Mentor not found.");
    }

    // Check if the mentor actually has a mentor role or can accept mentoring requests
    // You might want to add additional validation here based on your business logic

    // Create the session
    const newSession = this.sessionRepository.create({
      title: body.title,
      category: body.category as any, // Cast to avoid TypeScript strict checking
      type: SessionType.MENTORING,
      status: SessionStatus.PENDING,
      startTime: body.startTime,
      endTime: body.endTime,
      description: body.description,
      agenda: body.agenda,
      meetingLink: body.meetingLink,
      user, // student who requested
      mentor, // mentor who will receive the request
    });

    const savedSession = await this.sessionRepository.save(newSession);

    // Send emails to both mentor and student
    try {
      const startTimeFormatted = new Date(body.startTime).toLocaleString();
      const endTimeFormatted = body.endTime ? new Date(body.endTime).toLocaleString() : undefined;

      const frontendUrl = config.frontend.url;
      const confirmUrl = `${frontendUrl}/sessions/${savedSession.id}/confirm?action=accept`;
      const declineUrl = `${frontendUrl}/sessions/${savedSession.id}/confirm?action=decline`;

      // Send email to mentor
      await emailService.sendSessionRequestToMentor(mentor.email, {
        mentorName: `${mentor.firstName} ${mentor.lastName}`,
        studentName: `${user.firstName} ${user.lastName}`,
        studentEmail: user.email,
        sessionTitle: body.title,
        sessionCategory: body.category,
        startTime: startTimeFormatted,
        endTime: endTimeFormatted,
        description: body.description,
        agenda: body.agenda,
        confirmUrl,
        declineUrl,
      });

      // Send confirmation email to student
      await emailService.sendSessionRequestToStudent(user.email, {
        studentName: `${user.firstName} ${user.lastName}`,
        mentorName: `${mentor.firstName} ${mentor.lastName}`,
        mentorEmail: mentor.email,
        sessionTitle: body.title,
        sessionCategory: body.category,
        startTime: startTimeFormatted,
        endTime: endTimeFormatted,
        description: body.description,
        agenda: body.agenda,
      });

    } catch (emailError) {
      console.error("Failed to send session request emails:", emailError);
      // You might want to log this error but not fail the session creation
    }

    return savedSession;
  }

  async confirmSession(sessionId: string, confirmationData: ConfirmSessionDto, mentorUser: User) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ["user", "mentor"],
    });

    if (!session) {
      throw new Error("Session not found.");
    }

    if (session.mentor?.id !== mentorUser.id) {
      throw new Error("Only the assigned mentor can confirm this session.");
    }

    if (session.status !== SessionStatus.PENDING) {
      throw new Error("Session is not in pending status.");
    }

    // Update session based on confirmation
    if (confirmationData.confirmed) {
      session.status = SessionStatus.CONFIRMED;
      session.confirmedAt = new Date();
      if (confirmationData.meetingLink) {
        session.meetingLink = confirmationData.meetingLink;
      }
    } else {
      session.status = SessionStatus.CANCELLED;
      session.cancellationReason = confirmationData.cancellationReason;
    }

    const updatedSession = await this.sessionRepository.save(session);

    // Send notification emails
    try {
      const startTimeFormatted = new Date(session.startTime).toLocaleString();
      const endTimeFormatted = session.endTime ? new Date(session.endTime).toLocaleString() : undefined;

      if (confirmationData.confirmed) {
        // Send confirmation emails to both participants
        await Promise.all([
          // Email to student
          emailService.sendSessionConfirmed(session.user.email, {
            participantName: `${session.user.firstName} ${session.user.lastName}`,
            otherParticipantName: `${session.mentor!.firstName} ${session.mentor!.lastName}`,
            otherParticipantEmail: session.mentor!.email,
            sessionTitle: session.title,
            sessionCategory: session.category,
            startTime: startTimeFormatted,
            endTime: endTimeFormatted,
            description: session.description,
            agenda: session.agenda,
            meetingLink: session.meetingLink,
            isStudent: true,
          }),
          // Email to mentor
          emailService.sendSessionConfirmed(session.mentor!.email, {
            participantName: `${session.mentor!.firstName} ${session.mentor!.lastName}`,
            otherParticipantName: `${session.user.firstName} ${session.user.lastName}`,
            otherParticipantEmail: session.user.email,
            sessionTitle: session.title,
            sessionCategory: session.category,
            startTime: startTimeFormatted,
            endTime: endTimeFormatted,
            description: session.description,
            agenda: session.agenda,
            meetingLink: session.meetingLink,
            isStudent: false,
          }),
        ]);
      } else {
        // Send cancellation emails
        const frontendUrl = config.frontend.url;
        const dashboardUrl = `${frontendUrl}/dashboard`;

        await Promise.all([
          // Email to student
          emailService.sendSessionCancelled(session.user.email, {
            participantName: `${session.user.firstName} ${session.user.lastName}`,
            otherParticipantName: `${session.mentor!.firstName} ${session.mentor!.lastName}`,
            sessionTitle: session.title,
            sessionCategory: session.category,
            startTime: startTimeFormatted,
            cancellationReason: session.cancellationReason,
            isStudent: true,
            dashboardUrl,
          }),
          // Email to mentor
          emailService.sendSessionCancelled(session.mentor!.email, {
            participantName: `${session.mentor!.firstName} ${session.mentor!.lastName}`,
            otherParticipantName: `${session.user.firstName} ${session.user.lastName}`,
            sessionTitle: session.title,
            sessionCategory: session.category,
            startTime: startTimeFormatted,
            cancellationReason: session.cancellationReason,
            isStudent: false,
            dashboardUrl,
          }),
        ]);
      }
    } catch (emailError) {
      console.error("Failed to send session confirmation/cancellation emails:", emailError);
    }

    return updatedSession;
  }

  async getMentoringSessions(userId: string, role: "student" | "mentor") {
    const query = this.sessionRepository
      .createQueryBuilder("session")
      .leftJoinAndSelect("session.user", "student")
      .leftJoinAndSelect("session.mentor", "mentor")
      .where("session.type = :type", { type: SessionType.MENTORING });

    if (role === "student") {
      query.andWhere("student.id = :userId", { userId });
    } else {
      query.andWhere("mentor.id = :userId", { userId });
    }

    return query
      .orderBy("session.startTime", "ASC")
      .getMany();
  }

  async getPendingSessions(mentorId: string) {
    return await this.sessionRepository.find({
      where: {
        mentor: { id: mentorId },
        status: SessionStatus.PENDING,
        type: SessionType.MENTORING,
      },
      relations: ["user", "mentor"],
      order: {
        createdAt: "DESC",
      },
    });
  }
}
