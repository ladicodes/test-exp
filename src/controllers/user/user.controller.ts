import { Request, Response } from "express";
import { UserService } from "../../services/user.service";
import { ResponseUtil } from "../../utils/response";
import { Repository } from "typeorm";
import { User } from "../../entities/user/user.entity";

export class UserController {
  private readonly userService: UserService;

  constructor(userRepository: Repository<User>) {
    this.userService = new UserService(userRepository);
  }

  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const query = req.query;
      const users = await this.userService.getAllUsers(query);
      return ResponseUtil.success(res, users, "Users retrieved successfully");
    } catch (error) {
      return ResponseUtil.error(res, "Error retrieving users", 500, error);
    }
  }

  async getUserInfo(req: Request, res: Response): Promise<Response> {
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) return ResponseUtil.error(res, "User not authenticated", 401);

    try {
      const user = await this.userService.getUserById(userId);
      if (!user) return ResponseUtil.error(res, "User not found", 404);
      return ResponseUtil.success(
        res,
        user,
        "User info retrieved successfully"
      );
    } catch (error) {
      return ResponseUtil.error(res, "Error retrieving user info", 500, error);
    }
  }

  async getUserById(req: Request, res: Response): Promise<Response> {
    const userId = req.params.id;
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) return ResponseUtil.error(res, "User not found", 404);
      return ResponseUtil.success(res, user, "User retrieved successfully");
    } catch (error) {
      return ResponseUtil.error(res, "Error retrieving user", 500, error);
    }
  }

  async getUsersByRole(req: Request, res: Response): Promise<Response> {
    const role = req.query.role as User["role"];
    try {
      const users = await this.userService.getUsersByRole(role);
      return ResponseUtil.success(res, users, "Users retrieved successfully");
    } catch (error) {
      return ResponseUtil.error(res, "Error retrieving users", 500, error);
    }
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    const userId = req.params.id;
    const userData = req.body;
    try {
      const updatedUser = await this.userService.updateUser(userId, userData);
      if (!updatedUser) return ResponseUtil.error(res, "User not found", 404);
      return ResponseUtil.success(
        res,
        updatedUser,
        "User updated successfully"
      );
    } catch (error) {
      return ResponseUtil.error(res, "Error updating user", 500, error);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    const userId = req.params.id;
    try {
      await this.userService.deleteUser(userId);
      return ResponseUtil.success(res, null, "User deleted successfully");
    } catch (error) {
      return ResponseUtil.error(res, "Error deleting user", 500, error);
    }
  }
}
