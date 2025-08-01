import express from "express";
import { DiaryController } from "../../../controllers/diary/diary.controller";
import { AppDataSource } from "../../../utils/data-source";
import { Diary } from "../../../entities/diary/diary.entity";

const router = express.Router();

const diaryRepository = AppDataSource.getRepository(Diary);
const diaryController = new DiaryController(diaryRepository);

// create a new diary entry
router.post("/", diaryController.createDiaryEntry.bind(diaryController));

// get all diary entries
router.get("/", diaryController.getDiaryEntries.bind(diaryController));

// update a diary entry by id
router.put("/:id", diaryController.updateDiaryEntry.bind(diaryController));

// delete a diary entry by id
router.delete("/:id", diaryController.deleteDiaryEntry.bind(diaryController));

export default router;
