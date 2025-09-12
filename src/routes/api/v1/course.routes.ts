import express from "express";
import { CourseController } from "../../../controllers/course/course.controller";
import { AppDataSource } from "../../../utils/data-source";
import { validateBody } from "../../../middleware/validate.middleware";
import {
  instructorAuthMiddleware,
  authMiddleware,
} from "../../../middleware/auth.middleware";
import { Course } from "../../../entities/course/course.entity";
import { User } from "../../../entities/user/user.entity";
import { CreateCourseDto } from "../../../entities/course/dto/create-course.dto";
import { UpdateCourseDto } from "../../../entities/course/dto/update-course.dto";

const router = express.Router();

const courseController = new CourseController(
  AppDataSource.getRepository(Course),
  AppDataSource.getRepository(User)
);

router.post(
  "/",
  instructorAuthMiddleware,
  validateBody(CreateCourseDto),
  courseController.createCourse.bind(courseController)
);

router.get(
  "/",
  authMiddleware,
  courseController.getCourses.bind(courseController)
);

router.get(
  "/:id",
  authMiddleware,
  courseController.getCourseById.bind(courseController)
);

router.put(
  "/:id",
  instructorAuthMiddleware,
  validateBody(UpdateCourseDto),
  courseController.updateCourse.bind(courseController)
);

router.delete(
  "/:id",
  instructorAuthMiddleware,
  courseController.deleteCourse.bind(courseController)
);

export default router;
