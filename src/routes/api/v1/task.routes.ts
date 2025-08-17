import express from "express";
import { TaskController } from "../../../controllers/tasks/task.controller";
import { AppDataSource } from "../../../utils/data-source";
import { Task } from "../../../entities/tasks/task.entity";
import { validateBody } from "../../../middleware/validate.middleware";
import { CreateTaskDto } from "../../../entities/tasks/dto/create-task.dto";
import {
  instructorAuthMiddleware,
  authMiddleware,
} from "../../../middleware/auth.middleware";
import { User } from "../../../entities/user/user.entity";

const router = express.Router();

const taskController = new TaskController(
  AppDataSource.getRepository(Task),
  AppDataSource.getRepository(User)
);

router.post(
  "/",
  authMiddleware,
  validateBody(CreateTaskDto),
  taskController.createTask.bind(taskController)
);

router.get(
  "/",
  authMiddleware,
  taskController.getAllTasks.bind(taskController)
);

router.get(
  "/user",
  authMiddleware,
  taskController.getUserTasks.bind(taskController)
);

router.get(
  "/:id",
  authMiddleware,
  taskController.getTaskById.bind(taskController)
);

router.put(
  "/:id",
  authMiddleware,
  validateBody(CreateTaskDto),
  taskController.updateTask.bind(taskController)
);

router.delete(
  "/:id",
  authMiddleware,
  taskController.deleteTask.bind(taskController)
);

export default router;
