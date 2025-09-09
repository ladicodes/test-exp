import { Repository } from "typeorm";
import { Course } from "../entities/course/course.entity";
import { User, UserRole } from "../entities/user/user.entity";
import { CreateCourseDto } from "../entities/course/dto/create-course.dto";
import { UpdateCourseDto } from "../entities/course/dto/update-course.dto";
import { Diary } from "../entities/diary/diary.entity";
import { Task } from "../entities/tasks/task.entity";

export class AdminService {
    private readonly courseRepository: Repository<Course>;
    private readonly userRepository: Repository<User>;
    private readonly diaryRepository: Repository<Diary>;
    private readonly taskRepository: Repository<Task>;

    constructor(
        courseRepository: Repository<Course>,
        userRepository: Repository<User>,
        diaryRepository: Repository<Diary>,
        taskRepository: Repository<Task>
    ) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.diaryRepository = diaryRepository;
        this.taskRepository = taskRepository;
    }

    async getDashboardStats() {
        const [menteeCount, mentorCount, taskCount, diaryCount] = await Promise.all([
            this.userRepository.count({ where: { role: UserRole.STUDENT } }),
            this.userRepository.count({ where: { role: UserRole.INSTRUCTOR } }),
            this.taskRepository.count(),
            this.diaryRepository.count()
        ]);

        return {
            mentees: menteeCount,
            mentors: mentorCount,
            tasks: taskCount,
            diaryEntries: diaryCount
        };
    }

    async changeUserRole(userId: string, newRole: UserRole) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        
        if (!user) {
            throw new Error("User not found");
        }

        user.role = newRole;
        await this.userRepository.save(user);

        return user;
    }

    async deactivateUser(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        
        if (!user) {
            throw new Error("User not found");
        }

        await this.userRepository.softDelete(userId);
        return { message: "User deactivated successfully" };
    }

    async permanentlyDeleteUser(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        
        if (!user) {
            throw new Error("User not found");
        }

        await this.userRepository.delete(userId);
        return { message: "User permanently deleted" };
    }

    async assignMentorToMentee(menteeId: string, mentorId: string) {
        const [mentee, mentor] = await Promise.all([
            this.userRepository.findOne({ where: { id: menteeId } }),
            this.userRepository.findOne({ where: { id: mentorId } })
        ]);

        if (!mentee) {
            throw new Error("Mentee not found");
        }

        if (!mentor) {
            throw new Error("Mentor not found");
        }

        if (mentee.role !== UserRole.STUDENT) {
            throw new Error("Mentee must be a student");
        }

        if (mentor.role !== UserRole.INSTRUCTOR) {
            throw new Error("Mentor must be an instructor");
        }

        if (menteeId === mentorId) {
            throw new Error("A user cannot be their own mentor");
        }

        mentee.mentor = mentor;
        await this.userRepository.save(mentee);

        return {
            mentee: {
                id: mentee.id,
                firstName: mentee.firstName,
                lastName: mentee.lastName,
                email: mentee.email
            },
            mentor: {
                id: mentor.id,
                firstName: mentor.firstName,
                lastName: mentor.lastName,
                email: mentor.email
            }
        };
    }

    async getAllDiaryEntries(userId?: string) {
        const queryBuilder = this.diaryRepository.createQueryBuilder("diary")
            .leftJoinAndSelect("diary.user", "user")
            .select([
                "diary.id",
                "diary.title",
                "diary.whatWorkOn",
                "diary.whatLearned",
                "diary.whatCouldBeBetter",
                "diary.howItFeels",
                "diary.goalsForNextTime",
                "diary.createdAt",
                "diary.updatedAt",
                "user.id",
                "user.firstName",
                "user.lastName",
                "user.email"
            ]);

        if (userId) {
            queryBuilder.where("user.id = :userId", { userId });
        }

        return queryBuilder.orderBy("diary.createdAt", "DESC").getMany();
    }

    async getSingleDiaryEntry(diaryId: string) {
        const diaryEntry = await this.diaryRepository.findOne({
            where: { id: diaryId },
            relations: ["user"],
            select: {
                id: true,
                title: true,
                whatWorkOn: true,
                whatLearned: true,
                whatCouldBeBetter: true,
                howItFeels: true,
                goalsForNextTime: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            }
        });

        if (!diaryEntry) {
            throw new Error("Diary entry not found");
        }

        return diaryEntry;
    }

    async removeDiaryEntry(diaryId: string) {
        const diaryEntry = await this.diaryRepository.findOne({ where: { id: diaryId } });
        
        if (!diaryEntry) {
            throw new Error("Diary entry not found");
        }

        await this.diaryRepository.delete(diaryId);
        return { message: "Diary entry deleted successfully" };
    }
}
