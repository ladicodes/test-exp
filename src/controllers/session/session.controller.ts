import { Repository } from "typeorm";
import { SessionService } from "../../services/session.service";
import { Session } from "../../entities/session/session.entity";
import { Request, Response } from "express";
import { CreateSessionDto } from "../../entities/session/dto/create-session.dto";
import { UpdateSessionDto } from "../../entities/session/dto/update-session.dto";
import { ResponseUtil } from "../../utils/response";
import { User } from "../../entities/user/user.entity";

export class SessionController {
  private readonly sessionService: SessionService;

  constructor(
    sessionRepository: Repository<Session>,
    userRepository: Repository<User>
  ) {
    this.sessionService = new SessionService(sessionRepository, userRepository);
  }

  async createSession(req: Request, res: Response) {
    const body: CreateSessionDto = req.body;

    try {
      const session = await this.sessionService.createSession({
        // @ts-ignore
        user: req.user as User,
        body,
      });
      return ResponseUtil.success(
        res,
        session,
        "Session created successfully",
        201
      );
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async getAllSessions(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      const sessions = await this.sessionService.getAllSessions(
        userId as string | undefined
      );
      return ResponseUtil.success(
        res,
        sessions,
        "Sessions fetched successfully"
      );
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async getSessionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const session = await this.sessionService.getSessionById(id);
      return ResponseUtil.success(res, session, "Session fetched successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async updateSession(req: Request, res: Response) {
    const body: UpdateSessionDto = req.body;

    try {
      const { id } = req.params;
      const updatedSession = await this.sessionService.updateSession(id, body);
      return ResponseUtil.success(
        res,
        updatedSession,
        "Session updated successfully"
      );
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async deleteSession(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.sessionService.deleteSession(id);
      return ResponseUtil.success(res, result, "Session deleted successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }
}
