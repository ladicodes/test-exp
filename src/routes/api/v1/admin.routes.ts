import express from "express";
import { authenticateAndAuthorize } from "../../../middleware/auth.middleware";
import { UserRole } from "../../../entities/user/user.entity";
import { AdminController } from "../../../controllers/admin/admin.controller";
import { AppDataSource } from "../../../utils/data-source";
import { Course } from "../../../entities/course/course.entity";
import { User } from "../../../entities/user/user.entity";
import { Diary } from "../../../entities/diary/diary.entity";
import { Task } from "../../../entities/tasks/task.entity";
import { Session } from "../../../entities/session/session.entity";

const router = express.Router();

const courseRepository = AppDataSource.getRepository(Course);
const userRepository = AppDataSource.getRepository(User);
const diaryRepository = AppDataSource.getRepository(Diary);
const taskRepository = AppDataSource.getRepository(Task);
const sessionRepository = AppDataSource.getRepository(Session);

const adminController = new AdminController(courseRepository, userRepository, diaryRepository, taskRepository, sessionRepository);

router.get("/dashboard", authenticateAndAuthorize(UserRole.ADMIN), adminController.getDashboard.bind(adminController));
router.put("/users/:userId/role", authenticateAndAuthorize(UserRole.ADMIN), adminController.changeUserRole.bind(adminController));
router.patch("/users/:userId/deactivate", authenticateAndAuthorize(UserRole.ADMIN), adminController.deactivateUser.bind(adminController));
router.delete("/users/:userId", authenticateAndAuthorize(UserRole.ADMIN), adminController.permanentlyDeleteUser.bind(adminController));
router.post("/mentor-assignment", authenticateAndAuthorize(UserRole.ADMIN), adminController.assignMentorToMentee.bind(adminController));

// Diary management routes
router.get("/diary", authenticateAndAuthorize(UserRole.ADMIN), adminController.getAllDiaryEntries.bind(adminController));
router.get("/diary/:diaryId", authenticateAndAuthorize(UserRole.ADMIN), adminController.getSingleDiaryEntry.bind(adminController));
router.delete("/diary/:diaryId", authenticateAndAuthorize(UserRole.ADMIN), adminController.removeDiaryEntry.bind(adminController));

export default router;