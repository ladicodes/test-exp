import express from "express";
import { CourseProgressController } from "../../../controllers/course-progress/course-progress.controller";
import { CourseProgressService } from "../../../services/course-progress.service";
import { AppDataSource } from "../../../utils/data-source";
import { CourseProgress } from "../../../entities/course-progress/course-progress.entity";
import { Course } from "../../../entities/course/course.entity";
import { authenticate } from "../../../middleware/auth.middleware";
import { validateBody } from "../../../middleware/validate.middleware";
import { MarkCourseDoneDto } from "../../../entities/course-progress/dto/mark-course-done.dto";

const router = express.Router();

const courseProgressRepository = AppDataSource.getRepository(CourseProgress);
const courseRepository = AppDataSource.getRepository(Course);

const courseProgressService = new CourseProgressService(
  courseProgressRepository,
  courseRepository
);

const courseProgressController = new CourseProgressController(courseProgressService);

// Mark course as done
router.post(
  "/mark-done",
  authenticate,
  validateBody(MarkCourseDoneDto),
  courseProgressController.markCourseAsDone.bind(courseProgressController)
);

// Mark course as undone
router.post(
  "/mark-undone",
  authenticate,
  validateBody(MarkCourseDoneDto),
  courseProgressController.markCourseAsUndone.bind(courseProgressController)
);

// Get user's course progress (optionally filtered by curriculum)
router.get(
  "/",
  authenticate,
  courseProgressController.getUserProgress.bind(courseProgressController)
);

// Get curriculum progress with completion percentage
router.get(
  "/curriculum/:curriculumId",
  authenticate,
  courseProgressController.getCurriculumProgress.bind(courseProgressController)
);

export default router;