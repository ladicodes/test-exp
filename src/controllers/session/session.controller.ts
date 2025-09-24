import { Repository } from "typeorm";
import { SessionService } from "../../services/session.service";
import { Session } from "../../entities/session/session.entity";
import { Request, Response } from "express";
import { CreateSessionDto } from "../../entities/session/dto/create-session.dto";
import { UpdateSessionDto } from "../../entities/session/dto/update-session.dto";
import { ScheduleMentoringSessionDto } from "../../entities/session/dto/schedule-mentoring-session.dto";
import { ConfirmSessionDto } from "../../entities/session/dto/confirm-session.dto";
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

  // New mentoring session methods
  async scheduleMentoringSession(req: Request, res: Response) {
    const body: ScheduleMentoringSessionDto = req.body;

    try {
      const session = await this.sessionService.scheduleMentoringSession({
        // @ts-ignore
        user: req.user as User,
        body,
      });
      return ResponseUtil.success(
        res,
        session,
        "Mentoring session scheduled successfully. Email notifications sent.",
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

  async confirmSession(req: Request, res: Response) {
    const body: ConfirmSessionDto = req.body;
    const { sessionId } = req.params;

    try {
      const session = await this.sessionService.confirmSession(
        sessionId,
        body,
        // @ts-ignore
        req.user as User
      );
      
      const action = body.confirmed ? "confirmed" : "cancelled";
      return ResponseUtil.success(
        res,
        session,
        `Session ${action} successfully. Email notifications sent.`
      );
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async getMentoringSessions(req: Request, res: Response) {
    try {
      // @ts-ignore
      const user = req.user as User;
      const { role } = req.query; // "student" or "mentor"
      
      const userRole = role as "student" | "mentor";
      if (!userRole || !["student", "mentor"].includes(userRole)) {
        return ResponseUtil.error(res, "Invalid role. Must be 'student' or 'mentor'", 400);
      }

      const sessions = await this.sessionService.getMentoringSessions(user.id, userRole);
      return ResponseUtil.success(
        res,
        sessions,
        "Mentoring sessions fetched successfully"
      );
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async getPendingSessions(req: Request, res: Response) {
    try {
      // @ts-ignore
      const user = req.user as User;
      
      const sessions = await this.sessionService.getPendingSessions(user.id);
      return ResponseUtil.success(
        res,
        sessions,
        "Pending sessions fetched successfully"
      );
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  // Handle email confirmation links (accept/decline)
  async handleEmailConfirmation(req: Request, res: Response) {
    const { sessionId } = req.params;
    const { action, token } = req.query; // action: "accept" or "decline"

    try {
      // For now, we'll redirect to frontend with the session info
      // In a production app, you might want to implement secure tokens
      const session = await this.sessionService.getSessionById(sessionId);
      
      if (!session || !session.mentor) {
        return res.status(404).send(`
          <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h2>❌ Session Not Found</h2>
              <p>The session you're looking for doesn't exist or has been removed.</p>
            </body>
          </html>
        `);
      }

      const frontendUrl = "http://localhost:3000"; // You should get this from config
      const redirectUrl = `${frontendUrl}/sessions/${sessionId}/confirm?action=${action}`;
      
      return res.redirect(redirectUrl);
    } catch (error) {
      return res.status(500).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2>❌ Error</h2>
            <p>An error occurred while processing your request.</p>
            <p><small>${error instanceof Error ? error.message : "Unknown error"}</small></p>
          </body>
        </html>
      `);
    }
  }
}
