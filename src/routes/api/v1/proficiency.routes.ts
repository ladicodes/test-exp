import express from "express";
import { ProficiencyController } from "../../../controllers/proficiency/proficiency.controller";
import { ProficiencyService } from "../../../services/proficiency.service";
import { AppDataSource } from "../../../utils/data-source";
import { ProficiencyTest, AssignedCurriculum } from "../../../entities/proficiency/proficiency.entity";
import { Curriculum } from "../../../entities/course/course.entity";
import { authenticate } from "../../../middleware/auth.middleware";
import { validateBody } from "../../../middleware/validate.middleware";
import { SubmitProficiencyDto } from "../../../entities/proficiency/dto/submit-proficiency.dto";

const router = express.Router();

const proficiencyTestRepository = AppDataSource.getRepository(ProficiencyTest);
const assignedCurriculumRepository = AppDataSource.getRepository(AssignedCurriculum);
const curriculumRepository = AppDataSource.getRepository(Curriculum);

const proficiencyService = new ProficiencyService(
  proficiencyTestRepository,
  assignedCurriculumRepository,
  curriculumRepository
);

const proficiencyController = new ProficiencyController(proficiencyService);

// Submit proficiency test and get assigned curriculums
router.post(
  "/submit",
  authenticate,
  validateBody(SubmitProficiencyDto),
  proficiencyController.submitProficiencyTest.bind(proficiencyController)
);

// Get user's assigned curriculums
router.get(
  "/assigned-curriculums",
  authenticate,
  proficiencyController.getAssignedCurriculums.bind(proficiencyController)
);

// Get user's proficiency test history
router.get(
  "/tests",
  authenticate,
  proficiencyController.getProficiencyTests.bind(proficiencyController)
);

export default router;