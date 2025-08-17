import { Repository } from "typeorm";
import { Request, Response } from "express";
import { LessonService } from "../../services/lesson.service";
import { ResponseUtil } from "../../utils/response";
import { Lesson } from "../../entities/course/lesson.entity";
import { Course } from "../../entities/course/course.entity";
import { CreateLessonDto } from "../../entities/course/dto/create-lesson.dto";
import { UpdateLessonDto } from "../../entities/course/dto/update-lesson.dto";

export class LessonController {
  private readonly lessonService: LessonService;

  constructor(
    lessonRepository: Repository<Lesson>,
    courseRepository: Repository<Course>
  ) {
    this.lessonService = new LessonService(lessonRepository, courseRepository);
  }

  async createLesson(req: Request, res: Response) {
    const body: CreateLessonDto = req.body;
    const { courseId } = req.params;

    try {
      const lesson = await this.lessonService.createLesson({ courseId, body });
      return ResponseUtil.success(
        res,
        lesson,
        "Lesson created successfully",
        201
      );
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async getLessons(req: Request, res: Response) {
    const { courseId } = req.params;
    try {
      const lessons = await this.lessonService.getLessons(courseId);
      return ResponseUtil.success(res, lessons, "Lessons fetched successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async getLessonById(req: Request, res: Response) {
    try {
      const lesson = await this.lessonService.getLessonById(req.params.id);
      return ResponseUtil.success(res, lesson, "Lesson fetched successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async updateLesson(req: Request, res: Response) {
    const body: UpdateLessonDto = req.body;
    try {
      const lesson = await this.lessonService.updateLesson(req.params.id, body);
      return ResponseUtil.success(res, lesson, "Lesson updated successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async deleteLesson(req: Request, res: Response) {
    try {
      const result = await this.lessonService.deleteLesson(req.params.id);
      return ResponseUtil.success(res, result, "Lesson deleted successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }
}
