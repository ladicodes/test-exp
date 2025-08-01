import { Repository } from "typeorm";
import { TaskService } from "../../services/task.service";
import { Task } from "../../entities/tasks/task.entity";
import { Request, Response } from "express";
import { CreateTaskDto } from "../../entities/tasks/dto/create-task.dto";
import { ResponseUtil } from "../../utils/response";
import { User } from "../../entities/user/user.entity";

export class TaskController {
  private readonly taskService: TaskService;

  constructor(
    taskRepository: Repository<Task>,
    userRepository: Repository<User>
  ) {
    this.taskService = new TaskService(taskRepository, userRepository);
  }

  async createTask(req: Request, res: Response) {
    const body: CreateTaskDto = req.body;

    try {
      // @ts-ignore
      const task = await this.taskService.createTask({ user: req.user, body });
      return ResponseUtil.success(res, task, "Task created successfully", 201);
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await this.taskService.getAllTasks();
      return ResponseUtil.success(res, tasks, "Tasks retrieved successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async getUserTasks(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user?.id as string;

    try {
      const tasks = await this.taskService.getUserTasks(userId, req.query);
      return ResponseUtil.success(
        res,
        tasks,
        "User tasks retrieved successfully"
      );
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async getTaskById(req: Request, res: Response) {
    const taskId = req.params.id;

    try {
      const task = await this.taskService.getTaskById(taskId);
      if (!task) {
        return ResponseUtil.error(res, "Task not found", 404);
      }
      return ResponseUtil.success(res, task, "Task retrieved successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async updateTask(req: Request, res: Response) {
    const taskId = req.params.id;
    const body: CreateTaskDto = req.body;

    try {
      const updatedTask = await this.taskService.updateTask(taskId, body);
      return ResponseUtil.success(
        res,
        updatedTask,
        "Task updated successfully"
      );
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }

  async deleteTask(req: Request, res: Response) {
    const taskId = req.params.id;

    try {
      await this.taskService.deleteTask(taskId);
      return ResponseUtil.success(res, null, "Task deleted successfully");
    } catch (error) {
      return ResponseUtil.error(
        res,
        error instanceof Error ? error.message : "Internal Server Error",
        500
      );
    }
  }
}
