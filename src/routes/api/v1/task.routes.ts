import express from "express";
import { TaskController } from "../../../controllers/tasks/task.controller";
import { AppDataSource } from "../../../utils/data-source";
import { Task } from "../../../entities/tasks/task.entity";
import { validateBody } from "../../../middleware/validate.middleware";
import {
  CreateTaskDto,
  UpdateTaskDto,
} from "../../../entities/tasks/dto/create-task.dto";
import {
  instructorAuthMiddleware,
  authMiddleware, authenticateAndAuthorize,
} from "../../../middleware/auth.middleware";
import {User, UserRole} from "../../../entities/user/user.entity";

const router = express.Router();

const taskController = new TaskController(
  AppDataSource.getRepository(Task),
  AppDataSource.getRepository(User)
);

router.post(
  "/",
    authenticateAndAuthorize(),
  validateBody(CreateTaskDto),
  taskController.createTask.bind(taskController)
);

router.get(
  "/",
    authenticateAndAuthorize(),
  taskController.getAllTasks.bind(taskController)
);

router.get(
  "/user",
    authenticateAndAuthorize(),
  taskController.getUserTasks.bind(taskController)
);

router.get(
  "/:id",
  authenticateAndAuthorize(),
  taskController.getTaskById.bind(taskController)
);

router.put(
  "/:id",
    authenticateAndAuthorize(),
  validateBody(UpdateTaskDto),
  taskController.updateTask.bind(taskController)
);

router.delete(
  "/:id",
    authenticateAndAuthorize(),
  taskController.deleteTask.bind(taskController)
);

export default router;
