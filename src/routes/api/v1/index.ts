import express from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import diaryRoutes from "./diary.routes";
import taskRoutes from "./task.routes";
import profileRoutes from "./profile.routes";
import sessionRoutes from "./session.routes";
import adminRoutes from "./admin.routes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/diary", diaryRoutes);
router.use("/tasks", taskRoutes);
router.use("/profile", profileRoutes);
router.use("/sessions", sessionRoutes);
router.use("/admin", adminRoutes);

export default router;
