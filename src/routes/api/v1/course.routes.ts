import express from "express";
import { CourseController } from "../../../controllers/course/course.controller";
import { AppDataSource } from "../../../utils/data-source";
import { Course, Curriculum } from "../../../entities/course/course.entity";
import { User } from "../../../entities/user/user.entity";

const router = express.Router();

const courseController = new CourseController(
    AppDataSource.getRepository(Course),
    AppDataSource.getRepository(Curriculum),
    AppDataSource.getRepository(User)
);

// Public read-only routes (no authentication required)
router.get(
    "/",
    courseController.getCourses.bind(courseController)
);

router.get(
    "/:id",
    courseController.getCourseById.bind(courseController)
);

export default router;