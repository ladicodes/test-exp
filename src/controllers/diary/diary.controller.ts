import { Repository } from "typeorm";
import { DiaryService } from "../../services/diary.service";
import { Diary } from "../../entities/diary/diary.entity";
import { ResponseUtil } from "../../utils/response";
import { Request, Response } from "express";

export class DiaryController {
  private readonly diaryService: DiaryService;

  constructor(diaryRepository: Repository<Diary>) {
    this.diaryService = new DiaryService(diaryRepository);
  }

  async createDiaryEntry(req: Request, res: Response): Promise<Response> {
    const diaryData = req.body;
    // @ts-ignore
    const userId = req.user?.id;

    if (!userId) {
      return ResponseUtil.error(res, "User authentication required", 401);
    }

    try {
      const newEntry = await this.diaryService.createDiaryEntry(diaryData, userId);

      return ResponseUtil.success(
          res,
          newEntry,
          "Diary entry created successfully"
      );
    } catch (error: any) {
      if (error.message === "User not found") {
        return ResponseUtil.error(res, "User not found", 404, error);
      }
      return ResponseUtil.error(
          res,
          error.message || "Failed to create diary entry",
          500,
          error
      );
    }
  }

  async getDiaryEntries(req: Request, res: Response): Promise<Response> {
    try {
      const entries = await this.diaryService.getDiaryEntries();
      return ResponseUtil.success(
          res,
          entries,
          "Diary entries retrieved successfully"
      );
    } catch (error: any) {
      return ResponseUtil.error(
          res,
          error.message || "Failed to retrieve diary entries",
          500,
          error
      );
    }
  }

  async updateDiaryEntry(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const diaryData = req.body;

    try {
      const updatedEntry = await this.diaryService.updateDiaryEntry(
          id,
          diaryData
      );
      return ResponseUtil.success(
          res,
          updatedEntry,
          "Diary entry updated successfully"
      );
    } catch (error: any) {
      return ResponseUtil.error(
          res,
          error.message || "Failed to update diary entry",
          500,
          error
      );
    }
  }

  async deleteDiaryEntry(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const result = await this.diaryService.deleteDiaryEntry(id);
      return ResponseUtil.success(
          res,
          result,
          "Diary entry deleted successfully"
      );
    } catch (error: any) {
      return ResponseUtil.error(
          res,
          error.message || "Failed to delete diary entry",
          500,
          error
      );
    }
  }
}