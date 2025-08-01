import { Repository } from "typeorm";
import { Task } from "../entities/tasks/task.entity";
import { CreateTaskDto } from "../entities/tasks/dto/create-task.dto";
import { User } from "../entities/user/user.entity";
import { isBefore } from "date-fns";

export class TaskService {
  private readonly taskRepository: Repository<Task>;
  private readonly userRepository: Repository<User>;

  constructor(
    taskRepository: Repository<Task>,
    userRepository: Repository<User>
  ) {
    this.taskRepository = taskRepository;
    this.userRepository = userRepository;
  }

  async createTask({ body, user }: { user?: User; body: CreateTaskDto }) {
    if (body.tags && body.tags.length > 5)
      throw new Error("You can only assign a maximum of 5 tags to a task");

    if (isBefore(new Date(body.dueDate), new Date()))
      throw new Error("Due date cannot be in the past.");

    const userAssigned = await this.userRepository.findOneBy({
      id: body.assignedTo,
    });

    const userAssignedBy = await this.userRepository.findOneBy({
      id: user?.id,
    });

    if (!userAssigned) throw new Error("Assigned user not found");
    if (!userAssignedBy) throw new Error("Assigned by user not found");

    if (userAssigned.role !== "student")
      throw new Error("You can only assign tasks to students");

    const task = this.taskRepository.create({
      ...body,
      assignedBy: userAssignedBy,
      assignedTo: userAssigned,
    });

    await this.taskRepository.save(task);
  }

  async getAllTasks() {
    return this.taskRepository.find({
      relations: ["assignedTo", "assignedBy"],
    });
  }

  async getUserTasks(userId: string, query?: any) {
    return this.taskRepository.find({
      where: { assignedTo: { id: userId } },
      relations: ["assignedBy"],
      select: {
        assignedBy: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
    });
  }

  async getTaskById(taskId: string) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ["assignedBy"],
      select: {
        assignedBy: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
    });

    if (!task) throw new Error("Task not found");

    return task;
  }

  async updateTask(taskId: string, body: CreateTaskDto) {
    const task = await this.getTaskById(taskId);

    if (body.tags && body.tags.length > 5)
      throw new Error("You can only assign a maximum of 5 tags to a task");

    if (isBefore(new Date(body.dueDate), new Date()))
      throw new Error("Due date cannot be in the past.");

    Object.assign(task, body);
    await this.taskRepository.save(task);
  }

  async deleteTask(taskId: string) {
    const task = await this.getTaskById(taskId);

    if (!task) throw new Error("Task not found");

    await this.taskRepository.remove(task);
  }
}
