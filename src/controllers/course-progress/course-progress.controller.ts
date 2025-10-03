import { Request, Response } from "express";
import { CourseProgressService } from "../../services/course-progress.service";
import { ResponseUtil } from "../../utils/response";

export class CourseProgressController {
  private readonly courseProgressService: CourseProgressService;

  constructor(courseProgressService: CourseProgressService) {
    this.courseProgressService = courseProgressService;
  }

  async markCourseAsDone(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { courseId } = req.body;

      if (!courseId) {
        return ResponseUtil.error(res, "Course ID is required", 400);
      }

      const progress = await this.courseProgressService.markCourseAsDone(userId, courseId);

      return ResponseUtil.success(
        res,
        progress,
        "Course marked as completed"
      );
    } catch (error) {
      return ResponseUtil.error(res, error instanceof Error ? error.message : "Failed to mark course as done", 400);
    }
  }

  async markCourseAsUndone(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { courseId } = req.body;

      if (!courseId) {
        return ResponseUtil.error(res, "Course ID is required", 400);
      }

      const progress = await this.courseProgressService.markCourseAsUndone(userId, courseId);

      return ResponseUtil.success(
        res,
        progress,
        "Course marked as incomplete"
      );
    } catch (error) {
      return ResponseUtil.error(res, error instanceof Error ? error.message : "Failed to mark course as undone", 400);
    }
  }

  async getUserProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const curriculumId = req.query.curriculumId as string | undefined;

      const progress = await this.courseProgressService.getUserCourseProgress(userId, curriculumId);

      return ResponseUtil.success(
        res,
        progress,
        "User course progress retrieved successfully"
      );
    } catch (error) {
      return ResponseUtil.error(res, error instanceof Error ? error.message : "Failed to retrieve user progress");
    }
  }

  async getCurriculumProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { curriculumId } = req.params;

      if (!curriculumId) {
        return ResponseUtil.error(res, "Curriculum ID is required", 400);
      }

      const progress = await this.courseProgressService.getCurriculumProgress(userId, curriculumId);

      return ResponseUtil.success(
        res,
        progress,
        "Curriculum progress retrieved successfully"
      );
    } catch (error) {
      return ResponseUtil.error(res, error instanceof Error ? error.message : "Failed to retrieve curriculum progress");
    }
  }
}