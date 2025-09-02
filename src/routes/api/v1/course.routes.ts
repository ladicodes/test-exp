import express from "express";
import {CourseController} from "../../../controllers/course/course.controller";
import {AppDataSource} from "../../../utils/data-source";
import {validateBody} from "../../../middleware/validate.middleware";
import {authenticateAndAuthorize, authMiddleware, instructorAuthMiddleware,} from "../../../middleware/auth.middleware";
import {Course} from "../../../entities/course/course.entity";
import {User, UserRole} from "../../../entities/user/user.entity";
import {CreateCourseDto} from "../../../entities/course/dto/create-course.dto";
import {UpdateCourseDto} from "../../../entities/course/dto/update-course.dto";

const router = express.Router();

const courseController = new CourseController(
  AppDataSource.getRepository(Course),
  AppDataSource.getRepository(User)
);

router.post(
  "/",
  authenticateAndAuthorize(UserRole.INSTRUCTOR),
  validateBody(CreateCourseDto),
  courseController.createCourse.bind(courseController)
);

router.get(
  "/",
  authenticateAndAuthorize(),
  courseController.getCourses.bind(courseController)
);

router.get(
  "/:id",
    authenticateAndAuthorize(),
  courseController.getCourseById.bind(courseController)
);

router.put(
  "/:id",
    authenticateAndAuthorize(UserRole.INSTRUCTOR),
  validateBody(UpdateCourseDto),
  courseController.updateCourse.bind(courseController)
);

router.delete(
  "/:id",
    authenticateAndAuthorize(UserRole.INSTRUCTOR),
  courseController.deleteCourse.bind(courseController)
);

export default router;
