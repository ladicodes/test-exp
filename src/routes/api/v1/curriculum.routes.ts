import express from "express";
import { CurriculumController } from "../../../controllers/course/curriculum.controller";
import { AppDataSource } from "../../../utils/data-source";
import { authenticateAndAuthorize } from "../../../middleware/auth.middleware";
import { Curriculum } from "../../../entities/course/course.entity";

const router = express.Router();

const curriculumController = new CurriculumController(
    AppDataSource.getRepository(Curriculum)
);

// Public read-only routes (no authentication required)
router.get(
    "/",
    curriculumController.getCurriculums.bind(curriculumController)
);

router.get(
    "/:id",
    curriculumController.getCurriculumById.bind(curriculumController)
);

export default router;