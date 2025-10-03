import { Repository } from "typeorm";
import { CourseProgress } from "../entities/course-progress/course-progress.entity";
import { Course } from "../entities/course/course.entity";

export class CourseProgressService {
  private readonly courseProgressRepository: Repository<CourseProgress>;
  private readonly courseRepository: Repository<Course>;

  constructor(
    courseProgressRepository: Repository<CourseProgress>,
    courseRepository: Repository<Course>
  ) {
    this.courseProgressRepository = courseProgressRepository;
    this.courseRepository = courseRepository;
  }

  async markCourseAsDone(userId: string, courseId: string) {
    // Verify course exists
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    // Check if progress record exists
    let progress = await this.courseProgressRepository.findOne({
      where: { userId, courseId },
    });

    if (progress) {
      // Update existing progress
      progress.isCompleted = true;
      progress.completedAt = new Date();
    } else {
      // Create new progress record
      progress = this.courseProgressRepository.create({
        userId,
        courseId,
        isCompleted: true,
        completedAt: new Date(),
      });
    }

    return await this.courseProgressRepository.save(progress);
  }

  async markCourseAsUndone(userId: string, courseId: string) {
    const progress = await this.courseProgressRepository.findOne({
      where: { userId, courseId },
    });

    if (!progress) {
      throw new Error("Course progress not found");
    }

    progress.isCompleted = false;
    progress.completedAt = undefined;

    return await this.courseProgressRepository.save(progress);
  }

  async getUserCourseProgress(userId: string, curriculumId?: string) {
    const queryBuilder = this.courseProgressRepository
      .createQueryBuilder("progress")
      .leftJoinAndSelect("progress.course", "course")
      .leftJoinAndSelect("course.curriculum", "curriculum")
      .where("progress.userId = :userId", { userId });

    if (curriculumId) {
      queryBuilder.andWhere("course.curriculumId = :curriculumId", { curriculumId });
    }

    return await queryBuilder.getMany();
  }

  async getCurriculumProgress(userId: string, curriculumId: string) {
    const allCourses = await this.courseRepository.find({
      where: { curriculum: { id: curriculumId } },
    });

    const completedCourses = await this.courseProgressRepository.find({
      where: {
        userId,
        courseId: allCourses.map(c => c.id).length > 0 ? undefined : "",
        isCompleted: true,
      },
      relations: ["course"],
    });

    const completedCourseIds = new Set(
      completedCourses
        .filter(cp => allCourses.some(c => c.id === cp.courseId))
        .map(cp => cp.courseId)
    );

    const totalCourses = allCourses.length;
    const completedCount = completedCourseIds.size;
    const progressPercentage = totalCourses > 0 ? (completedCount / totalCourses) * 100 : 0;

    return {
      curriculumId,
      totalCourses,
      completedCourses: completedCount,
      progressPercentage: Math.round(progressPercentage),
      courses: allCourses.map(course => ({
        ...course,
        isCompleted: completedCourseIds.has(course.id),
      })),
    };
  }
}