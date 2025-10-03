import { Repository } from "typeorm";
import { Request, Response } from "express";
import { CourseService } from "../../services/course.service";
import { ResponseUtil } from "../../utils/response";
import { Course, Curriculum } from "../../entities/course/course.entity";
import { User } from "../../entities/user/user.entity";
import { CreateCourseDto } from "../../entities/course/dto/create-course.dto";
import { UpdateCourseDto } from "../../entities/course/dto/update-course.dto";

export class CourseController {
  private readonly courseService: CourseService;

  constructor(
    courseRepository: Repository<Course>,
    curriculumRepository: Repository<Curriculum>,
    userRepository: Repository<User>
  ) {
    this.courseService = new CourseService(courseRepository, curriculumRepository, userRepository);
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

}
