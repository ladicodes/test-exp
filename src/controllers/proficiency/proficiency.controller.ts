import { Request, Response } from "express";
import { ProficiencyService } from "../../services/proficiency.service";
import { ResponseUtil } from "../../utils/response";
import { SubmitProficiencyDto } from "../../entities/proficiency/dto/submit-proficiency.dto";

export class ProficiencyController {
  private readonly proficiencyService: ProficiencyService;

  constructor(proficiencyService: ProficiencyService) {
    this.proficiencyService = proficiencyService;
  }

  async submitProficiencyTest(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const dto: SubmitProficiencyDto = req.body;

      const result = await this.proficiencyService.submitProficiencyTest(userId, dto);

      return ResponseUtil.success(
        res,
        {
          proficiencyTest: result.proficiencyTest,
          assignedCurriculums: result.assignedCurriculums,
        },
        "Proficiency test submitted successfully and curriculums assigned",
        201
      );
    } catch (error) {
      return ResponseUtil.error(res, error instanceof Error ? error.message : "Failed to submit proficiency test");
    }
  }

  async getAssignedCurriculums(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const curriculums = await this.proficiencyService.getUserAssignedCurriculums(userId);

      return ResponseUtil.success(
        res,
        curriculums,
        "Assigned curriculums retrieved successfully"
      );
    } catch (error) {
      return ResponseUtil.error(res, error instanceof Error ? error.message : "Failed to retrieve assigned curriculums");
    }
  }

  async getProficiencyTests(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const tests = await this.proficiencyService.getUserProficiencyTests(userId);

      return ResponseUtil.success(
        res,
        tests,
        "Proficiency tests retrieved successfully"
      );
    } catch (error) {
      return ResponseUtil.error(res, error instanceof Error ? error.message : "Failed to retrieve proficiency tests");
    }
  }
}