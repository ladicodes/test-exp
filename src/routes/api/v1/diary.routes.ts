import express from "express";
import { DiaryController } from "../../../controllers/diary/diary.controller";
import { AppDataSource } from "../../../utils/data-source";
import { Diary } from "../../../entities/diary/diary.entity";
import {authenticateAndAuthorize, authMiddleware} from "../../../middleware/auth.middleware";
import {UserRole} from "../../../entities/user/user.entity";

const router = express.Router();

const diaryRepository = AppDataSource.getRepository(Diary);
const diaryController = new DiaryController(diaryRepository);

// create a new diary entry
router.post("/", authenticateAndAuthorize(), diaryController.createDiaryEntry.bind(diaryController));

// get all diary entries
router.get("/", authenticateAndAuthorize(), diaryController.getDiaryEntries.bind(diaryController));

// update a diary entry by id
router.put("/:id", authenticateAndAuthorize(), diaryController.updateDiaryEntry.bind(diaryController));

// delete a diary entry by id
router.delete("/:id", authenticateAndAuthorize(), diaryController.deleteDiaryEntry.bind(diaryController));

export default router;