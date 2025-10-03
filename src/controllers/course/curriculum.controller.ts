import { Repository } from "typeorm";
import { Request, Response } from "express";
import { CurriculumService } from "../../services/curriculum.service";
import { ResponseUtil } from "../../utils/response";
import { Curriculum } from "../../entities/course/course.entity";
import { CreateCurriculumDto } from "../../entities/course/dto/create-curriculum.dto";
import { UpdateCurriculumDto } from "../../entities/course/dto/update-curriculum.dto";

export class CurriculumController {
  private readonly curriculumService: CurriculumService;

  constructor(curriculumRepository: Repository<Curriculum>) {
    this.curriculumService = new CurriculumService(curriculumRepository);
  }

  async getCurriculums(req: Request, res: Response) {
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