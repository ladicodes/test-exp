import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { User, UserRole } from "../entities/user/user.entity";
import { CreateUserDTO } from "../entities/user/dto/create-user.entity";

export class UserService {
  private readonly userRepository: Repository<User>;

  constructor(userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async getAllUsers(query?: { role?: UserRole }): Promise<User[]> {
    const where: FindOptionsWhere<User> = {};
    if (query?.role) where.role = query.role;

    return this.userRepository.find({ where });
  }

  async userExists(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id } });
    return !!user;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUser(
    id: string,
    data: Partial<CreateUserDTO>
  ): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) return null;

      Object.assign(user, data);

      await this.userRepository.save(user);
      return this.getUserById(id);
    } catch (error) {
      return null;
    }
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  async getUsersByRole(role: User["role"]): Promise<User[]> {
    return this.userRepository.find({ where: { role } });
  }

  /**
   * Search users by name, email, or phone number.
   * @param query - The search keyword.
   */
  async searchUsers(query: string): Promise<User[]> {
    return this.userRepository.find({
      where: [
        { firstName: ILike(`%${query}%`) },
        { lastName: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
        { phoneNumber: ILike(`%${query}%`) },
      ],
    });
  }
}
