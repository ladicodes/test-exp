import { Repository } from "typeorm";
import { Course } from "../entities/course/course.entity";
import { User } from "../entities/user/user.entity";
import { CreateCourseDto } from "../entities/course/dto/create-course.dto";
import { UpdateCourseDto } from "../entities/course/dto/update-course.dto";

export class CourseService {
  private readonly courseRepository: Repository<Course>;
  private readonly userRepository: Repository<User>;

  constructor(
    courseRepository: Repository<Course>,
    userRepository: Repository<User>
  ) {
    this.courseRepository = courseRepository;
    this.userRepository = userRepository;
  }

  async createCourse({ body, user }: { user?: User; body: CreateCourseDto }) {
    if (!user) throw new Error("Unauthorized");

    const instructor = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!instructor) throw new Error("Instructor not found");

    const course = this.courseRepository.create({
      ...body,
      instructor,
    });

    return await this.courseRepository.save(course);
  }

  async getCourses() {
    return await this.courseRepository.find({
      relations: ["instructor", "lessons"],
    });
  }

  async getCourseById(courseId: string) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ["instructor", "lessons"],
    });
    if (!course) throw new Error("Course not found");
    return course;
  }

  async updateCourse(courseId: string, body: UpdateCourseDto) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!course) throw new Error("Course not found");

    Object.assign(course, body);
    return await this.courseRepository.save(course);
  }

  async deleteCourse(courseId: string) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!course) throw new Error("Course not found");

    await this.courseRepository.remove(course);
    return { message: "Course deleted successfully" };
  }
}
