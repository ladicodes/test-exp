import { Repository } from "typeorm";
import { Diary } from "../entities/diary/diary.entity";

export class DiaryService {
  private readonly diaryRepository: Repository<Diary>;

  constructor(diaryRepository: Repository<Diary>) {
    this.diaryRepository = diaryRepository;
  }

  async createDiaryEntry(body: any) {
    const diaryEntry = this.diaryRepository.create(body);
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
