import { Repository } from "typeorm";
import { Curriculum } from "../entities/course/course.entity";
import { CreateCurriculumDto } from "../entities/course/dto/create-curriculum.dto";
import { UpdateCurriculumDto } from "../entities/course/dto/update-curriculum.dto";

export class CurriculumService {
  private readonly curriculumRepository: Repository<Curriculum>;

  constructor(curriculumRepository: Repository<Curriculum>) {
    this.curriculumRepository = curriculumRepository;
  }

  async createCurriculum(body: CreateCurriculumDto) {
    const curriculum = this.curriculumRepository.create(body);
    return await this.curriculumRepository.save(curriculum);
  }

  async getCurriculums() {
    return await this.curriculumRepository.find({
      relations: ["courses", "courses.instructor"],
    });
  }

  async getCurriculumById(curriculumId: string) {
    const curriculum = await this.curriculumRepository.findOne({
      where: { id: curriculumId },
      relations: ["courses", "courses.instructor"],
    });
    if (!curriculum) throw new Error("Curriculum not found");
    return curriculum;
  }

  async updateCurriculum(curriculumId: string, body: UpdateCurriculumDto) {
    const curriculum = await this.curriculumRepository.findOne({
      where: { id: curriculumId },
    });
    if (!curriculum) throw new Error("Curriculum not found");

    Object.assign(curriculum, body);
    return await this.curriculumRepository.save(curriculum);
  }

  async deleteCurriculum(curriculumId: string) {
    const curriculum = await this.curriculumRepository.findOne({
      where: { id: curriculumId },
    });
    if (!curriculum) throw new Error("Curriculum not found");

    await this.curriculumRepository.remove(curriculum);
    return { message: "Curriculum deleted successfully" };
  }
}