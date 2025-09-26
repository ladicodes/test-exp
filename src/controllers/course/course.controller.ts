import { Repository } from "typeorm";
import { Request, Response } from "express";
import { CourseService } from "../../services/course.service";
import { ResponseUtil } from "../../utils/response";
import { Course } from "../../entities/course/course.entity";
import { User } from "../../entities/user/user.entity";
import { CreateCourseDto } from "../../entities/course/dto/create-course.dto";
import { UpdateCourseDto } from "../../entities/course/dto/update-course.dto";

export class CourseController {
  private readonly courseService: CourseService;

  constructor(
    courseRepository: Repository<Course>,
    userRepository: Repository<User>
  ) {
    this.courseService = new CourseService(courseRepository, userRepository);
  }

  async createCourse(req: Request, res: Response) {
    const body: CreateCourseDto = req.body;
    try {
      const course = await this.courseService.createCourse({
        // @ts-ignore
        user: req.user,
        body,
      });
      return ResponseUtil.success(
        res,
        course,
        "Course created successfully",
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

  async getCourses(req: Request, res: Response) {
    try {
      const courses = await this.courseService.getCourses();
      return ResponseUtil.success(res, courses, "Courses fetched successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async getCourseById(req: Request, res: Response) {
    try {
      const course = await this.courseService.getCourseById(req.params.id);
      return ResponseUtil.success(res, course, "Course fetched successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async updateCourse(req: Request, res: Response) {
    const body: UpdateCourseDto = req.body;
    try {
      const course = await this.courseService.updateCourse(req.params.id, body);
      return ResponseUtil.success(res, course, "Course updated successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async deleteCourse(req: Request, res: Response) {
    try {
      const result = await this.courseService.deleteCourse(req.params.id);
      return ResponseUtil.success(res, result, "Course deleted successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }
}
