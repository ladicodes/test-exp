import { Repository } from "typeorm";
import { ResponseUtil } from "../../utils/response";
import { Request, Response } from "express";
import { AdminService } from "../../services/admin.service";
import { Course } from "../../entities/course/course.entity";
import { User, UserRole } from "../../entities/user/user.entity";
import { Diary } from "../../entities/diary/diary.entity";
import { Task } from "../../entities/tasks/task.entity";
import { Session } from "../../entities/session/session.entity";

export class AdminController {
    private readonly adminService: AdminService;

    constructor(
        courseRepository: Repository<Course>,
        userRepository: Repository<User>,
        diaryRepository: Repository<Diary>,
        taskRepository: Repository<Task>,
        sessionRepository: Repository<Session>
    ) {
        this.adminService = new AdminService(courseRepository, userRepository, diaryRepository, taskRepository, sessionRepository);
    }


    async getDashboard(req: Request, res: Response) {
        try {
            const stats = await this.adminService.getDashboardStats();
            return ResponseUtil.success(res, stats, "Dashboard stats retrieved successfully");
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            return ResponseUtil.error(res, "Internal server error", 500);
        }
    }

    async changeUserRole(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const { role } = req.body;

            if (!userId) {
                return ResponseUtil.error(res, "User ID is required", 400);
            }

            if (!role || !Object.values(UserRole).includes(role)) {
                return ResponseUtil.error(res, "Valid role is required (admin, student, instructor)", 400);
            }

            const updatedUser = await this.adminService.changeUserRole(userId, role);
            return ResponseUtil.success(res, updatedUser, "User role updated successfully");
        } catch (error) {
            console.error("Error changing user role:", error);
            if (error instanceof Error && error.message === "User not found") {
                return ResponseUtil.error(res, "User not found", 404);
            }
            return ResponseUtil.error(res, "Internal server error", 500);
        }
    }

    async deactivateUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return ResponseUtil.error(res, "User ID is required", 400);
            }

            const result = await this.adminService.deactivateUser(userId);
            return ResponseUtil.success(res, result, "User deactivated successfully");
        } catch (error) {
            console.error("Error deactivating user:", error);
            if (error instanceof Error && error.message === "User not found") {
                return ResponseUtil.error(res, "User not found", 404);
            }
            return ResponseUtil.error(res, "Internal server error", 500);
        }
    }

    async permanentlyDeleteUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return ResponseUtil.error(res, "User ID is required", 400);
            }

            const result = await this.adminService.permanentlyDeleteUser(userId);
            return ResponseUtil.success(res, result, "User permanently deleted");
        } catch (error) {
            console.error("Error permanently deleting user:", error);
            if (error instanceof Error && error.message === "User not found") {
                return ResponseUtil.error(res, "User not found", 404);
            }
            return ResponseUtil.error(res, "Internal server error", 500);
        }
    }

    async assignMentorToMentee(req: Request, res: Response) {
        try {
            const { menteeId, mentorId } = req.body;

            if (!menteeId || !mentorId) {
                return ResponseUtil.error(res, "Both menteeId and mentorId are required", 400);
            }

            const result = await this.adminService.assignMentorToMentee(menteeId, mentorId);
            return ResponseUtil.success(res, result, "Mentor assigned to mentee successfully");
        } catch (error) {
            console.error("Error assigning mentor to mentee:", error);
            if (error instanceof Error) {
                const errorMessage = error.message;
                if (errorMessage === "Mentee not found" || errorMessage === "Mentor not found") {
                    return ResponseUtil.error(res, errorMessage, 404);
                }
                if (errorMessage === "Mentee must be a student" ||
                    errorMessage === "Mentor must be an instructor" ||
                    errorMessage === "A user cannot be their own mentor") {
                    return ResponseUtil.error(res, errorMessage, 400);
                }
            }
            return ResponseUtil.error(res, "Internal server error", 500);
        }
    }

    async getAllDiaryEntries(req: Request, res: Response) {
        try {
            const { userId } = req.query;
            const diaryEntries = await this.adminService.getAllDiaryEntries(userId as string);
            return ResponseUtil.success(res, diaryEntries, "Diary entries retrieved successfully");
        } catch (error) {
            console.error("Error fetching diary entries:", error);
            return ResponseUtil.error(res, "Internal server error", 500);
        }
    }

    async getSingleDiaryEntry(req: Request, res: Response) {
        try {
            const { diaryId } = req.params;

            if (!diaryId) {
                return ResponseUtil.error(res, "Diary ID is required", 400);
            }

            const diaryEntry = await this.adminService.getSingleDiaryEntry(diaryId);
            return ResponseUtil.success(res, diaryEntry, "Diary entry retrieved successfully");
        } catch (error) {
            console.error("Error fetching diary entry:", error);
            if (error instanceof Error && error.message === "Diary entry not found") {
                return ResponseUtil.error(res, "Diary entry not found", 404);
            }
            return ResponseUtil.error(res, "Internal server error", 500);
        }
    }

    async removeDiaryEntry(req: Request, res: Response) {
        try {
            const { diaryId } = req.params;

            if (!diaryId) {
                return ResponseUtil.error(res, "Diary ID is required", 400);
            }

            const result = await this.adminService.removeDiaryEntry(diaryId);
            return ResponseUtil.success(res, result, "Diary entry deleted successfully");
        } catch (error) {
            console.error("Error deleting diary entry:", error);
            if (error instanceof Error && error.message === "Diary entry not found") {
                return ResponseUtil.error(res, "Diary entry not found", 404);
            }
            return ResponseUtil.error(res, "Internal server error", 500);
        }
    }
}