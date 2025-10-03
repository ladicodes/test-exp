import { Repository } from "typeorm";
import { Course, Curriculum } from "../entities/course/course.entity";
import { User, UserRole } from "../entities/user/user.entity";
import { CreateCourseDto } from "../entities/course/dto/create-course.dto";
import { UpdateCourseDto } from "../entities/course/dto/update-course.dto";

export class CourseService {
  private readonly courseRepository: Repository<Course>;
  private readonly curriculumRepository: Repository<Curriculum>;
  private readonly userRepository: Repository<User>;

  constructor(
    courseRepository: Repository<Course>,
    curriculumRepository: Repository<Curriculum>,
    userRepository: Repository<User>
  ) {
    this.courseRepository = courseRepository;
    this.curriculumRepository = curriculumRepository;
    this.userRepository = userRepository;
  }

  async createCourse(body: CreateCourseDto) {
    const curriculum = await this.curriculumRepository.findOne({
      where: { id: body.curriculumId },
    });
    if (!curriculum) throw new Error("Curriculum not found");

    let instructor = undefined;
    if (body.instructorId) {
      instructor = await this.userRepository.findOne({
        where: { id: body.instructorId },
      });
      if (!instructor) throw new Error("Instructor not found");
      if (instructor.role !== UserRole.INSTRUCTOR && instructor.role !== UserRole.ADMIN) {
        throw new Error("User must have instructor or admin role");
      }
    }

    const course = this.courseRepository.create({
      title: body.title,
      description: body.description,
      endDate: body.endDate,
      videoUrl: body.videoUrl,
      lessonType: body.lessonType,
      curriculum,
      instructor,
    });

    return await this.courseRepository.save(course);
  }

  async getCourses() {
    return await this.courseRepository.find({
      relations: ["instructor", "curriculum"],
    });
  }

  async getCourseById(courseId: string) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ["instructor", "curriculum"],
    });
    if (!course) throw new Error("Course not found");
    return course;
  }

  async updateCourse(courseId: string, body: UpdateCourseDto) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!course) throw new Error("Course not found");

    if (body.curriculumId) {
      const curriculum = await this.curriculumRepository.findOne({
        where: { id: body.curriculumId },
      });
      if (!curriculum) throw new Error("Curriculum not found");
      course.curriculum = curriculum;
    }

    if (body.instructorId !== undefined) {
      if (body.instructorId === null || body.instructorId === '') {
        // Remove instructor
        course.instructor = undefined;
      } else {
        const instructor = await this.userRepository.findOne({
          where: { id: body.instructorId },
        });
        if (!instructor) throw new Error("Instructor not found");
        if (instructor.role !== UserRole.INSTRUCTOR && instructor.role !== UserRole.ADMIN) {
          throw new Error("User must have instructor or admin role");
        }
        course.instructor = instructor;
      }
    }

    Object.assign(course, {
      title: body.title ?? course.title,
      description: body.description ?? course.description,
      endDate: body.endDate ?? course.endDate,
      videoUrl: body.videoUrl ?? course.videoUrl,
      lessonType: body.lessonType ?? course.lessonType,
    });

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
