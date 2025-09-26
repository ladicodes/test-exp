import { Repository } from "typeorm";
import { Lesson } from "../entities/course/lesson.entity";
import { Course } from "../entities/course/course.entity";
import { CreateLessonDto } from "../entities/course/dto/create-lesson.dto";
import { UpdateLessonDto } from "../entities/course/dto/update-lesson.dto";

export class LessonService {
  private readonly lessonRepository: Repository<Lesson>;
  private readonly courseRepository: Repository<Course>;

  constructor(
    lessonRepository: Repository<Lesson>,
    courseRepository: Repository<Course>
  ) {
    this.lessonRepository = lessonRepository;
    this.courseRepository = courseRepository;
  }

  async createLesson({
    courseId,
    body,
  }: {
    courseId: string;
    body: CreateLessonDto;
  }) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!course) throw new Error("Course not found");

    const lesson = this.lessonRepository.create({
      ...body,
      // course,
    });

    return await this.lessonRepository.save(lesson);
  }

  async getLessons(courseId: string) {
    return await this.lessonRepository.find({
      // where: { course: { id: courseId } },

      relations: ["course"],
      order: { order: "ASC" },
    });
  }

  async getLessonById(lessonId: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ["course"],
    });
    if (!lesson) throw new Error("Lesson not found");
    return lesson;
  }

  async updateLesson(lessonId: string, body: UpdateLessonDto) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });
    if (!lesson) throw new Error("Lesson not found");

    Object.assign(lesson, body);
    return await this.lessonRepository.save(lesson);
  }

  async deleteLesson(lessonId: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });
    if (!lesson) throw new Error("Lesson not found");

    await this.lessonRepository.remove(lesson);
    return { message: "Lesson deleted successfully" };
  }
}
