import { Repository } from "typeorm";
import { Course } from "../entities/course/course.entity";
import { User } from "../entities/user/user.entity";
import { CreateCourseDto } from "../entities/course/dto/create-course.dto";
import { UpdateCourseDto } from "../entities/course/dto/update-course.dto";
import {Diary} from "../entities/diary/diary.entity";

export class AdminService {
    private readonly courseRepository: Repository<Course>;
    private readonly userRepository: Repository<User>;
    private readonly diaryRepository: Repository<Diary>

    constructor(
        courseRepository: Repository<Course>,
        userRepository: Repository<User>
    ) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }


}
