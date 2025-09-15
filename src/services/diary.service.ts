import { Repository } from "typeorm";
import { Diary } from "../entities/diary/diary.entity";
import { User } from "../entities/user/user.entity";
import { AppDataSource } from "../utils/data-source";

export class DiaryService {
  private readonly diaryRepository: Repository<Diary>;
  private readonly userRepository: Repository<User>;

  constructor(diaryRepository: Repository<Diary>) {
    this.diaryRepository = diaryRepository;
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createDiaryEntry(body: any, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    const diaryEntry = this.diaryRepository.create({
      ...body,
      user: user
    });

    return this.diaryRepository.save(diaryEntry);
  }

  async getDiaryEntries() {
    return this.diaryRepository.find();
  }

  async updateDiaryEntry(id: string, body: any) {
    await this.diaryRepository.update(id, body);
    return this.diaryRepository.findOneBy({ id });
  }

  async deleteDiaryEntry(id: string) {
    const diaryEntry = await this.diaryRepository.findOneBy({ id });
    if (!diaryEntry) throw new Error("Diary entry not found");

    await this.diaryRepository.delete(id);
    return { message: "Diary entry deleted successfully" };
  }
}