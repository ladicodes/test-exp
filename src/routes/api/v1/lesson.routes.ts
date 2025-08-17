import express from "express";
import { AppDataSource } from "../../../utils/data-source";
import { validateBody } from "../../../middleware/validate.middleware";
import {
  instructorAuthMiddleware,
  authMiddleware,
} from "../../../middleware/auth.middleware";
import { LessonController } from "../../../controllers/course/lesson.controller";
import { Lesson } from "../../../entities/course/lesson.entity";
import { Course } from "../../../entities/course/course.entity";
import { CreateLessonDto } from "../../../entities/course/dto/create-lesson.dto";
import { UpdateLessonDto } from "../../../entities/course/dto/update-lesson.dto";

const router = express.Router();

const lessonController = new LessonController(
  AppDataSource.getRepository(Lesson),
  AppDataSource.getRepository(Course)
);

router.post(
  "/:courseId",
  instructorAuthMiddleware,
  validateBody(CreateLessonDto),
  lessonController.createLesson.bind(lessonController)
);

router.get(
  "/course/:courseId",
  authMiddleware,
  lessonController.getLessons.bind(lessonController)
);

router.get(
  "/:id",
  authMiddleware,
  lessonController.getLessonById.bind(lessonController)
);

router.put(
  "/:id",
  instructorAuthMiddleware,
  validateBody(UpdateLessonDto),
  lessonController.updateLesson.bind(lessonController)
);

router.delete(
  "/:id",
  instructorAuthMiddleware,
  lessonController.deleteLesson.bind(lessonController)
);

export default router;
