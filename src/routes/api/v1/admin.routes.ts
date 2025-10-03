import express from "express";
import { authenticateAndAuthorize } from "../../../middleware/auth.middleware";
import { UserRole } from "../../../entities/user/user.entity";
import { AdminController } from "../../../controllers/admin/admin.controller";
import { AdminCurriculumController, csvUpload } from "../../../controllers/admin/admin-curriculum.controller";
import { AppDataSource } from "../../../utils/data-source";
import { validateBody } from "../../../middleware/validate.middleware";
import { Course, Curriculum } from "../../../entities/course/course.entity";
import { User } from "../../../entities/user/user.entity";
import { Diary } from "../../../entities/diary/diary.entity";
import { Task } from "../../../entities/tasks/task.entity";
import { Session } from "../../../entities/session/session.entity";
import { CreateCurriculumDto } from "../../../entities/course/dto/create-curriculum.dto";
import { UpdateCurriculumDto } from "../../../entities/course/dto/update-curriculum.dto";
import { CreateCourseDto } from "../../../entities/course/dto/create-course.dto";
import { UpdateCourseDto } from "../../../entities/course/dto/update-course.dto";

const router = express.Router();

const courseRepository = AppDataSource.getRepository(Course);
const userRepository = AppDataSource.getRepository(User);
const diaryRepository = AppDataSource.getRepository(Diary);
const taskRepository = AppDataSource.getRepository(Task);
const sessionRepository = AppDataSource.getRepository(Session);
const curriculumRepository = AppDataSource.getRepository(Curriculum);

const adminController = new AdminController(courseRepository, userRepository, diaryRepository, taskRepository, sessionRepository);
const adminCurriculumController = new AdminCurriculumController(curriculumRepository, courseRepository, userRepository);

// Apply admin authentication to all routes
router.use(authenticateAndAuthorize(UserRole.ADMIN));

router.get("/dashboard", adminController.getDashboard.bind(adminController));
router.put("/users/:userId/role", adminController.changeUserRole.bind(adminController));
router.patch("/users/:userId/deactivate", adminController.deactivateUser.bind(adminController));
router.delete("/users/:userId", adminController.permanentlyDeleteUser.bind(adminController));
router.post("/mentor-assignment", authenticateAndAuthorize(UserRole.ADMIN), adminController.assignMentorToMentee.bind(adminController));

// Diary management routes
router.get("/diary", adminController.getAllDiaryEntries.bind(adminController));
router.get("/diary/:diaryId", adminController.getSingleDiaryEntry.bind(adminController));
router.delete("/diary/:diaryId", adminController.removeDiaryEntry.bind(adminController));

// Curriculum management routes
router.post("/curriculum", validateBody(CreateCurriculumDto), adminCurriculumController.createCurriculum.bind(adminCurriculumController));
router.get("/curriculum", adminCurriculumController.getAllCurriculums.bind(adminCurriculumController));
router.get("/curriculum/:id", adminCurriculumController.getCurriculumById.bind(adminCurriculumController));
router.put("/curriculum/:id", validateBody(UpdateCurriculumDto), adminCurriculumController.updateCurriculum.bind(adminCurriculumController));
router.delete("/curriculum/:id", adminCurriculumController.deleteCurriculum.bind(adminCurriculumController));

// Course management routes
router.post("/course", validateBody(CreateCourseDto), adminCurriculumController.createCourse.bind(adminCurriculumController));
router.put("/course/:id", validateBody(UpdateCourseDto), adminCurriculumController.updateCourse.bind(adminCurriculumController));
router.delete("/course/:id", adminCurriculumController.deleteCourse.bind(adminCurriculumController));

// CSV Import routes
router.post("/curriculum/import-csv", csvUpload.single('csvFile'), adminCurriculumController.importCurriculumFromCsv.bind(adminCurriculumController));
router.get("/curriculum/sample-csv", adminCurriculumController.downloadSampleCsv.bind(adminCurriculumController));

export default router;