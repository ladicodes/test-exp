import { Repository } from "typeorm";
import { Request, Response } from "express";
import multer from "multer";
import { CurriculumService } from "../../services/curriculum.service";
import { CourseService } from "../../services/course.service";
import { CsvImportService } from "../../services/csv-import.service";
import { ResponseUtil } from "../../utils/response";
import { Curriculum, Course } from "../../entities/course/course.entity";
import { User } from "../../entities/user/user.entity";
import { CreateCurriculumDto } from "../../entities/course/dto/create-curriculum.dto";
import { UpdateCurriculumDto } from "../../entities/course/dto/update-curriculum.dto";
import { CreateCourseDto } from "../../entities/course/dto/create-course.dto";
import { UpdateCourseDto } from "../../entities/course/dto/update-course.dto";

// Multer configuration for file uploads
const storage = multer.memoryStorage();
export const csvUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export class AdminCurriculumController {
  private readonly curriculumService: CurriculumService;
  private readonly courseService: CourseService;
  private readonly csvImportService: CsvImportService;

  constructor(
    curriculumRepository: Repository<Curriculum>,
    courseRepository: Repository<Course>,
    userRepository: Repository<User>
  ) {
    this.curriculumService = new CurriculumService(curriculumRepository);
    this.courseService = new CourseService(courseRepository, curriculumRepository, userRepository);
    this.csvImportService = new CsvImportService(curriculumRepository, courseRepository, userRepository);
  }

  // Curriculum management
  async createCurriculum(req: Request, res: Response) {
    const body: CreateCurriculumDto = req.body;
    try {
      const curriculum = await this.curriculumService.createCurriculum(body);
      return ResponseUtil.success(
        res,
        curriculum,
        "Curriculum created successfully",
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

  async updateCurriculum(req: Request, res: Response) {
    const body: UpdateCurriculumDto = req.body;
    try {
      const curriculum = await this.curriculumService.updateCurriculum(req.params.id, body);
      return ResponseUtil.success(res, curriculum, "Curriculum updated successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async deleteCurriculum(req: Request, res: Response) {
    try {
      const result = await this.curriculumService.deleteCurriculum(req.params.id);
      return ResponseUtil.success(res, result, "Curriculum deleted successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  // Course management
  async createCourse(req: Request, res: Response) {
    const body: CreateCourseDto = req.body;
    try {
      const course = await this.courseService.createCourse(body);
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

  // CSV Import functionality
  async importCurriculumFromCsv(req: Request, res: Response) {
    try {
      if (!req.file) {
        return ResponseUtil.error(res, "No CSV file provided", 400);
      }

      const result = await this.csvImportService.importFromCsv(req.file.buffer);

      if (result.success) {
        return ResponseUtil.success(res, result.data, result.message, 201);
      } else {
        return ResponseUtil.error(res, result.message, 400);
      }
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async downloadSampleCsv(req: Request, res: Response) {
    try {
      const sampleCsv = this.csvImportService.generateSampleCsv();

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="curriculum-sample.csv"');

      return res.send(sampleCsv);
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  // View endpoints (read-only, but admin restricted)
  async getAllCurriculums(req: Request, res: Response) {
    try {
      const curriculums = await this.curriculumService.getCurriculums();
      return ResponseUtil.success(res, curriculums, "Curriculums fetched successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async getCurriculumById(req: Request, res: Response) {
    try {
      const curriculum = await this.curriculumService.getCurriculumById(req.params.id);
      return ResponseUtil.success(res, curriculum, "Curriculum fetched successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }
}