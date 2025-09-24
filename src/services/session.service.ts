import { Repository } from "typeorm";
import { isBefore } from "date-fns";
import { Session } from "../entities/session/session.entity";
import { User } from "../entities/user/user.entity";
import { CreateSessionDto } from "../entities/session/dto/create-session.dto";
import { UpdateSessionDto } from "../entities/session/dto/update-session.dto";

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
}
