import { Repository } from "typeorm";
import { isBefore } from "date-fns";
import { Session } from "../entities/session/session.entity";
import { User, UserRole } from "../entities/user/user.entity";
import { CreateSessionDto } from "../entities/session/dto/create-session.dto";
import { UpdateSessionDto } from "../entities/session/dto/update-session.dto";
import { BookSessionDto } from "../entities/session/dto/book-session.dto";
import { EmailService } from "./email.service";

export class SessionService {
  private readonly sessionRepository: Repository<Session>;
  private readonly userRepository: Repository<User>;
  private readonly emailService: EmailService;

  constructor(
    sessionRepository: Repository<Session>,
    userRepository: Repository<User>,
    emailService: EmailService
  ) {
    this.sessionRepository = sessionRepository;
    this.userRepository = userRepository;
    this.emailService = emailService;
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

  async bookSession(intern: User, body: BookSessionDto) {
    // Validate start time
    if (isBefore(new Date(body.startTime), new Date())) {
      throw new Error("Start time cannot be in the past.");
    }

    // Validate end time if provided
    if (
      body.endTime &&
      isBefore(new Date(body.endTime), new Date(body.startTime))
    ) {
      throw new Error("End time cannot be before start time.");
    }

    // Check if the mentor exists and has the instructor role
    const mentor = await this.userRepository.findOne({
      where: { id: body.mentorId },
    });
    
    if (!mentor) {
      throw new Error("Mentor not found.");
    }
    
    if (mentor.role !== UserRole.INSTRUCTOR) {
      throw new Error("The selected user is not a mentor/instructor.");
    }

    // Check if intern is actually a student
    if (intern.role !== UserRole.STUDENT) {
      throw new Error("Only students can book sessions with mentors.");
    }

    // Check for scheduling conflicts for both mentor and intern
    const conflictQuery = this.sessionRepository
      .createQueryBuilder("session")
      .where(
        "(session.mentorId = :mentorId OR session.internId = :internId)",
        { mentorId: mentor.id, internId: intern.id }
      )
      .andWhere("session.status != :status", { status: "cancelled" })
      .andWhere(
        "(session.startTime <= :endTime AND session.endTime >= :startTime)",
        {
          startTime: new Date(body.startTime),
          endTime: body.endTime ? new Date(body.endTime) : new Date(body.startTime),
        }
      );

    const conflictingSessions = await conflictQuery.getMany();
    
    if (conflictingSessions.length > 0) {
      throw new Error("There is a scheduling conflict. Please choose a different time.");
    }

    // Create the session
    const newSession = this.sessionRepository.create({
      title: body.title,
      category: body.category,
      startTime: new Date(body.startTime),
      endTime: body.endTime ? new Date(body.endTime) : undefined,
      description: body.description,
      status: "scheduled",
      intern,
      mentor,
    });

    const savedSession = await this.sessionRepository.save(newSession);

    // Send email notifications
    try {
      // Email to intern (confirmation)
      await this.emailService.sendEmail({
        to: intern.email,
        subject: "Session Booking Confirmation",
        template: "session-booking-confirmation",
        data: {
          internName: `${intern.firstName} ${intern.lastName}`,
          mentorName: `${mentor.firstName} ${mentor.lastName}`,
          sessionTitle: body.title,
          sessionCategory: body.category,
          sessionDate: new Date(body.startTime).toLocaleDateString(),
          sessionTime: new Date(body.startTime).toLocaleTimeString(),
          sessionDescription: body.description || "No description provided",
        },
      });

      // Email to mentor (notification)
      await this.emailService.sendEmail({
        to: mentor.email,
        subject: "New Session Booking - Action Required",
        template: "session-booking-notification",
        data: {
          mentorName: `${mentor.firstName} ${mentor.lastName}`,
          internName: `${intern.firstName} ${intern.lastName}`,
          sessionTitle: body.title,
          sessionCategory: body.category,
          sessionDate: new Date(body.startTime).toLocaleDateString(),
          sessionTime: new Date(body.startTime).toLocaleTimeString(),
          sessionDescription: body.description || "No description provided",
          internEmail: intern.email,
          internPhone: intern.phoneNumber,
        },
      });
    } catch (emailError) {
      console.error("Failed to send session booking emails:", emailError);
      // Don't throw error here as session was created successfully
    }

    return savedSession;
  }

  async getMentorsAvailableForBooking() {
    return await this.userRepository.find({
      where: { role: UserRole.INSTRUCTOR },
      select: ['id', 'firstName', 'lastName', 'email', 'profilePicture', 'bio', 'skills', 'mainStack'],
    });
  }

  async getSessionsForUser(userId: string, role: UserRole) {
    const query = this.sessionRepository
      .createQueryBuilder("session")
      .leftJoinAndSelect("session.intern", "intern")
      .leftJoinAndSelect("session.mentor", "mentor")
      .orderBy("session.startTime", "ASC");

    if (role === UserRole.STUDENT) {
      query.where("session.internId = :userId", { userId });
    } else if (role === UserRole.INSTRUCTOR) {
      query.where("session.mentorId = :userId", { userId });
    }

    return await query.getMany();
  }
}
