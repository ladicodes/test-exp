import express from "express";
import {AppDataSource} from "../../../utils/data-source";
import {validateBody} from "../../../middleware/validate.middleware";
import {authenticateAndAuthorize, authMiddleware, instructorAuthMiddleware,} from "../../../middleware/auth.middleware";
import {LessonController} from "../../../controllers/course/lesson.controller";
import {Lesson} from "../../../entities/course/lesson.entity";
import {Course} from "../../../entities/course/course.entity";
import {CreateLessonDto} from "../../../entities/course/dto/create-lesson.dto";
import {UpdateLessonDto} from "../../../entities/course/dto/update-lesson.dto";
import {UserRole} from "../../../entities/user/user.entity";

const router = express.Router();

const lessonController = new LessonController(
  AppDataSource.getRepository(Lesson),
  AppDataSource.getRepository(Course)
);

router.post(
  "/:courseId",
    authenticateAndAuthorize(UserRole.INSTRUCTOR),
  validateBody(CreateLessonDto),
  lessonController.createLesson.bind(lessonController)
);

router.get(
  "/course/:courseId",
    authenticateAndAuthorize(UserRole.INSTRUCTOR),
  lessonController.getLessons.bind(lessonController)
);

router.get(
  "/:id",
    authenticateAndAuthorize(UserRole.INSTRUCTOR),
  lessonController.getLessonById.bind(lessonController)
);

router.put(
  "/:id",
    authenticateAndAuthorize(UserRole.INSTRUCTOR),
  validateBody(UpdateLessonDto),
  lessonController.updateLesson.bind(lessonController)
);

router.delete(
  "/:id",
    authenticateAndAuthorize(UserRole.INSTRUCTOR),
  lessonController.deleteLesson.bind(lessonController)
);

export default router;
