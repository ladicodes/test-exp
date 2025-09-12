import express from "express";
import { LeaderboardController } from "../../../controllers/leaderboard/leaderboard.controller";
import { AppDataSource } from "../../../utils/data-source";
import { User, UserRole } from "../../../entities/user/user.entity";
import { Session } from "../../../entities/session/session.entity";
import { Task } from "../../../entities/tasks/task.entity";
import { Course } from "../../../entities/course/course.entity";
import { Lesson } from "../../../entities/course/lesson.entity";
import { authenticateAndAuthorize } from "../../../middleware/auth.middleware";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const sessionRepository = AppDataSource.getRepository(Session);
const taskRepository = AppDataSource.getRepository(Task);
const courseRepository = AppDataSource.getRepository(Course);
const lessonRepository = AppDataSource.getRepository(Lesson);

const leaderboardController = new LeaderboardController(
  userRepository,
  sessionRepository,
  taskRepository,
  courseRepository,
  lessonRepository
);

// Get leaderboard with category and period filters
// Query params: category (attendance|course_progress|projects_completed|overall), period (week|month|all_time), limit
router.get(
  "/",
  authenticateAndAuthorize(),
  leaderboardController.getLeaderboard.bind(leaderboardController)
);

// Get current user's ranking
router.get(
  "/my-ranking",
  authenticateAndAuthorize(),
  leaderboardController.getUserRanking.bind(leaderboardController)
);

export default router;