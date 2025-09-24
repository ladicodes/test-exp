import express from "express";
import {AppDataSource} from "../../../utils/data-source";
import {Session} from "../../../entities/session/session.entity";
import {validateBody} from "../../../middleware/validate.middleware";
import {CreateSessionDto} from "../../../entities/session/dto/create-session.dto";
import {UpdateSessionDto} from "../../../entities/session/dto/update-session.dto";
import {authenticateAndAuthorize, instructorAuthMiddleware,} from "../../../middleware/auth.middleware";
import {User, UserRole} from "../../../entities/user/user.entity";
import {SessionController} from "../../../controllers/session/session.controller";
import {
  validateScheduleMentoringSession,
  validateConfirmSession,
} from "../../../validators/session.validator";

const router = express.Router();

const sessionController = new SessionController(
    AppDataSource.getRepository(Session),
    AppDataSource.getRepository(User)
);

// Create a new session (Instructor only)
router.post(
    "/",
    authenticateAndAuthorize(UserRole.INSTRUCTOR),
    validateBody(CreateSessionDto),
    sessionController.createSession.bind(sessionController)
);

// Get all sessions (Admin only or filterable)
router.get(
    "/",
    authenticateAndAuthorize(UserRole.ADMIN),
    sessionController.getAllSessions.bind(sessionController)
);

// Get a single session by ID (Authenticated users)
router.get(
    "/:id",
    authenticateAndAuthorize(),
    sessionController.getSessionById.bind(sessionController)
);

// Update a session (Instructor only)
router.put(
    "/:id",
    authenticateAndAuthorize(UserRole.INSTRUCTOR),
    validateBody(UpdateSessionDto),
    sessionController.updateSession.bind(sessionController)
);

// Delete a session (Instructor only)
router.delete(
    "/:id",
    authenticateAndAuthorize(UserRole.INSTRUCTOR),
    sessionController.deleteSession.bind(sessionController)
);

// Mentoring session routes
// Schedule a mentoring session (Students can request sessions with mentors)
router.post(
    "/mentoring/schedule",
    authenticateAndAuthorize(UserRole.STUDENT),
    validateScheduleMentoringSession,
    sessionController.scheduleMentoringSession.bind(sessionController)
);

// Confirm or decline a mentoring session (Mentors only)
router.put(
    "/mentoring/:sessionId/confirm",
    authenticateAndAuthorize(), // Any authenticated user, but service will validate mentor access
    validateConfirmSession,
    sessionController.confirmSession.bind(sessionController)
);

// Get mentoring sessions for current user (as student or mentor)
router.get(
    "/mentoring",
    authenticateAndAuthorize(),
    sessionController.getMentoringSessions.bind(sessionController)
);

// Get pending session requests for mentor
router.get(
    "/mentoring/pending",
    authenticateAndAuthorize(),
    sessionController.getPendingSessions.bind(sessionController)
);

// Public endpoint for email confirmation (no auth needed for email links)
router.get(
    "/:sessionId/confirm",
    sessionController.handleEmailConfirmation.bind(sessionController)
);

export default router;