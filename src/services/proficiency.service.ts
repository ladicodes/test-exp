import { Repository } from "typeorm";
import { ProficiencyTest, AssignedCurriculum, TechStack, ProficiencyLevel } from "../entities/proficiency/proficiency.entity";
import { Curriculum, CurriculumTitle } from "../entities/course/course.entity";
import { SubmitProficiencyDto } from "../entities/proficiency/dto/submit-proficiency.dto";

export class ProficiencyService {
  private readonly proficiencyTestRepository: Repository<ProficiencyTest>;
  private readonly assignedCurriculumRepository: Repository<AssignedCurriculum>;
  private readonly curriculumRepository: Repository<Curriculum>;

  constructor(
    proficiencyTestRepository: Repository<ProficiencyTest>,
    assignedCurriculumRepository: Repository<AssignedCurriculum>,
    curriculumRepository: Repository<Curriculum>
  ) {
    this.proficiencyTestRepository = proficiencyTestRepository;
    this.assignedCurriculumRepository = assignedCurriculumRepository;
    this.curriculumRepository = curriculumRepository;
  }

  private determineProficiencyLevel(score: number): ProficiencyLevel {
    return score >= 4 ? ProficiencyLevel.INTERMEDIATE : ProficiencyLevel.BEGINNER;
  }

  private async getCurriculumByTitlePattern(techStack: TechStack, level: ProficiencyLevel): Promise<Curriculum | null> {
    const levelStr = level === ProficiencyLevel.BEGINNER ? "Beginner" : "Intermediate";

    let titlePattern: string;
    switch (techStack) {
      case TechStack.BACKEND:
        titlePattern = `Backend Development - ${levelStr}`;
        break;
      case TechStack.FRONTEND:
        titlePattern = `Frontend Development - ${levelStr}`;
        break;
      case TechStack.QA:
        titlePattern = `QA - ${levelStr}`;
        break;
      case TechStack.UI_UX:
        titlePattern = `UI/UX Design - ${levelStr}`;
        break;
      case TechStack.DATA_SCIENCE:
        titlePattern = `Data Science - ${levelStr}`;
        break;
      default:
        return null;
    }

    const curriculum = await this.curriculumRepository.findOne({
      where: { title: titlePattern as CurriculumTitle }
    });

    return curriculum;
  }

  async submitProficiencyTest(userId: string, dto: SubmitProficiencyDto) {
    // Save proficiency test
    const proficiencyTest = this.proficiencyTestRepository.create({
      userId,
      backendScore: dto.backendScore,
      frontendScore: dto.frontendScore,
      qaScore: dto.qaScore,
      uiUxScore: dto.uiUxScore,
      dataScienceScore: dto.dataScienceScore,
    });

    await this.proficiencyTestRepository.save(proficiencyTest);

    // Remove existing assigned curriculums for this user
    await this.assignedCurriculumRepository.delete({ userId });

    // Assign curriculums based on scores
    const assignments: Array<{ techStack: TechStack; score: number }> = [
      { techStack: TechStack.BACKEND, score: dto.backendScore },
      { techStack: TechStack.FRONTEND, score: dto.frontendScore },
      { techStack: TechStack.QA, score: dto.qaScore },
      { techStack: TechStack.UI_UX, score: dto.uiUxScore },
      { techStack: TechStack.DATA_SCIENCE, score: dto.dataScienceScore },
    ];

    const assignedCurriculums: AssignedCurriculum[] = [];

    for (const assignment of assignments) {
      const level = this.determineProficiencyLevel(assignment.score);
      const curriculum = await this.getCurriculumByTitlePattern(assignment.techStack, level);

      if (curriculum) {
        const assignedCurriculum = this.assignedCurriculumRepository.create({
          userId,
          curriculumId: curriculum.id,
          techStack: assignment.techStack,
          score: assignment.score,
          level,
        });

        const saved = await this.assignedCurriculumRepository.save(assignedCurriculum);
        assignedCurriculums.push(saved);
      }
    }

    return {
      proficiencyTest,
      assignedCurriculums,
    };
  }

  async getUserAssignedCurriculums(userId: string) {
    return await this.assignedCurriculumRepository.find({
      where: { userId },
      relations: ["curriculum"],
      order: { createdAt: "DESC" },
    });
  }

  async getUserProficiencyTests(userId: string) {
    return await this.proficiencyTestRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }
}