import express from "express";
import { DiaryController } from "../../../controllers/diary/diary.controller";
import { AppDataSource } from "../../../utils/data-source";
import { Diary } from "../../../entities/diary/diary.entity";
import { authMiddleware } from "../../../middleware/auth.middleware";

const router = express.Router();

const diaryRepository = AppDataSource.getRepository(Diary);
const diaryController = new DiaryController(diaryRepository);

// create a new diary entry
router.post("/", authMiddleware, diaryController.createDiaryEntry.bind(diaryController));

// get all diary entries
router.get("/", authMiddleware, diaryController.getDiaryEntries.bind(diaryController));

// update a diary entry by id
router.put("/:id", authMiddleware, diaryController.updateDiaryEntry.bind(diaryController));

// delete a diary entry by id
router.delete("/:id", authMiddleware, diaryController.deleteDiaryEntry.bind(diaryController));

export default router;
