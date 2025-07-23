import { Repository } from "typeorm";
import { User } from "../entities/user/user.entity";
import { CreateUserDTO } from "../entities/user/dto/create-user.entity";

export class UserService {
  private readonly userRepository: Repository<User>;

  constructor(userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
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
    await this.userRepository.update(id, data);
    return this.getUserById(id);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  async getUsersByRole(role: User["role"]): Promise<User[]> {
    return this.userRepository.find({ where: { role } });
  }
}
