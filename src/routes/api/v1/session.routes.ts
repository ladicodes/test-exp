import express from "express";
import { AppDataSource } from "../../../utils/data-source";
import { Session } from "../../../entities/session/session.entity";
import { validateBody } from "../../../middleware/validate.middleware";
import { CreateSessionDto } from "../../../entities/session/dto/create-session.dto";
import { UpdateSessionDto } from "../../../entities/session/dto/update-session.dto";
import {
  adminAuthMiddleware,
  authMiddleware,
  instructorAuthMiddleware,
} from "../../../middleware/auth.middleware";
import { User } from "../../../entities/user/user.entity";
import { SessionController } from "../../../controllers/session/session.controller";

const router = express.Router();

const sessionController = new SessionController(
  AppDataSource.getRepository(Session),
  AppDataSource.getRepository(User)
);

// Create a new session (Instructor only)
router.post(
  "/",
  instructorAuthMiddleware,
  validateBody(CreateSessionDto),
  sessionController.createSession.bind(sessionController)
);

// Get all sessions (Admin only or filterable)
router.get(
  "/",
  authMiddleware,
  sessionController.getAllSessions.bind(sessionController)
);

// Get a single session by ID (Authenticated users)
router.get(
  "/:id",
  authMiddleware,
  sessionController.getSessionById.bind(sessionController)
);

// Update a session (Instructor only)
router.put(
  "/:id",
  instructorAuthMiddleware,
  validateBody(UpdateSessionDto),
  sessionController.updateSession.bind(sessionController)
);

// Delete a session (Instructor only)
router.delete(
  "/:id",
  instructorAuthMiddleware,
  sessionController.deleteSession.bind(sessionController)
);


export default router;
