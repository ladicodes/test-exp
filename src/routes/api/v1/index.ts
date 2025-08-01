import express from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import diaryRoutes from "./diary.routes";
import taskRoutes from "./task.routes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/diary", diaryRoutes);
router.use("/tasks", taskRoutes);

export default router;
