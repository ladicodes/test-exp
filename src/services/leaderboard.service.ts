import { Repository } from "typeorm";
import { User, UserRole } from "../entities/user/user.entity";
import { Session } from "../entities/session/session.entity";
import { Task, TaskStatus } from "../entities/tasks/task.entity";
import { Course } from "../entities/course/course.entity";

export enum LeaderboardPeriod {
    WEEK = "week",
    MONTH = "month",
    ALL_TIME = "all_time"
}

export enum LeaderboardCategory {
    ATTENDANCE = "attendance",
    COURSE_PROGRESS = "course_progress",
    PROJECTS_COMPLETED = "projects_completed",
    OVERALL = "overall"
}

export interface LeaderboardEntry {
    userId: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    score: number;
    rank: number;
    previousRank?: number;
    rankChange?: number;
    attendanceSessions: number;
    courseProgress: number;
    projectsCompleted: number;
}

export interface LeaderboardResponse {
    category: LeaderboardCategory;
    period: LeaderboardPeriod;
    entries: LeaderboardEntry[];
    totalEntries: number;
}

export class LeaderboardService {
    private readonly userRepository: Repository<User>;
    private readonly sessionRepository: Repository<Session>;
    private readonly taskRepository: Repository<Task>;
    private readonly courseRepository: Repository<Course>;

    constructor(
        userRepository: Repository<User>,
        sessionRepository: Repository<Session>,
        taskRepository: Repository<Task>,
        courseRepository: Repository<Course>,
    ) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.taskRepository = taskRepository;
        this.courseRepository = courseRepository;
    }

    async getLeaderboard(
        category: LeaderboardCategory,
        period: LeaderboardPeriod,
        limit: number = 50
    ): Promise<LeaderboardResponse> {
        const { startDate, previousStartDate } = this.getPeriodDates(period);

        // Get all mentees (students)
        const mentees = await this.userRepository.find({
            where: { role: UserRole.STUDENT },
            select: ["id", "firstName", "lastName", "profilePicture"]
        });

        let entries: LeaderboardEntry[] = [];

        switch (category) {
            case LeaderboardCategory.ATTENDANCE:
                entries = await this.getAttendanceLeaderboard(mentees, startDate, previousStartDate);
                break;
            case LeaderboardCategory.COURSE_PROGRESS:
                entries = await this.getCourseProgressLeaderboard(mentees, startDate, previousStartDate);
                break;
            case LeaderboardCategory.PROJECTS_COMPLETED:
                entries = await this.getProjectsLeaderboard(mentees, startDate, previousStartDate);
                break;
            case LeaderboardCategory.OVERALL:
                entries = await this.getOverallLeaderboard(mentees, startDate, previousStartDate);
                break;
        }

        // Sort by score and assign ranks
        entries.sort((a, b) => b.score - a.score);
        entries.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        // Limit results
        entries = entries.slice(0, limit);

        return {
            category,
            period,
            entries,
            totalEntries: entries.length
        };
    }

    private async getAttendanceLeaderboard(
        mentees: User[],
        startDate: Date | null,
        previousStartDate: Date | null
    ): Promise<LeaderboardEntry[]> {
        const entries: LeaderboardEntry[] = [];

        for (const mentee of mentees) {
            // Current period attendance
            const currentAttendance = await this.getAttendanceCount(mentee.id, startDate);

            // Previous period attendance for rank comparison
            const previousAttendance = previousStartDate ?
                await this.getAttendanceCount(mentee.id, previousStartDate, startDate) : 0;

            entries.push({
                userId: mentee.id,
                firstName: mentee.firstName,
                lastName: mentee.lastName,
                profilePicture: mentee.profilePicture,
                score: currentAttendance,
                rank: 0, // Will be set later
                attendanceSessions: currentAttendance,
                courseProgress: 0,
                projectsCompleted: 0
            });
        }

        // Calculate rank changes if we have previous data
        if (previousStartDate) {
            await this.calculateRankChanges(entries, previousStartDate, startDate, 'attendance');
        }

        return entries;
    }

    private async getCourseProgressLeaderboard(
        mentees: User[],
        startDate: Date | null,
        previousStartDate: Date | null
    ): Promise<LeaderboardEntry[]> {
        const entries: LeaderboardEntry[] = [];

        for (const mentee of mentees) {
            // For now, we'll calculate course progress based on completed tasks
            // In a real implementation, you'd track lesson completions
            const currentProgress = await this.getCourseProgressScore(mentee.id, startDate);

            entries.push({
                userId: mentee.id,
                firstName: mentee.firstName,
                lastName: mentee.lastName,
                profilePicture: mentee.profilePicture,
                score: currentProgress,
                rank: 0,
                attendanceSessions: 0,
                courseProgress: currentProgress,
                projectsCompleted: 0
            });
        }

        if (previousStartDate) {
            await this.calculateRankChanges(entries, previousStartDate, startDate, 'course_progress');
        }

        return entries;
    }

    private async getProjectsLeaderboard(
        mentees: User[],
        startDate: Date | null,
        previousStartDate: Date | null
    ): Promise<LeaderboardEntry[]> {
        const entries: LeaderboardEntry[] = [];

        for (const mentee of mentees) {
            const currentProjects = await this.getCompletedTasksCount(mentee.id, startDate);

            entries.push({
                userId: mentee.id,
                firstName: mentee.firstName,
                lastName: mentee.lastName,
                profilePicture: mentee.profilePicture,
                score: currentProjects,
                rank: 0,
                attendanceSessions: 0,
                courseProgress: 0,
                projectsCompleted: currentProjects
            });
        }

        if (previousStartDate) {
            await this.calculateRankChanges(entries, previousStartDate, startDate, 'projects_completed');
        }

        return entries;
    }

    private async getOverallLeaderboard(
        mentees: User[],
        startDate: Date | null,
        previousStartDate: Date | null
    ): Promise<LeaderboardEntry[]> {
        const entries: LeaderboardEntry[] = [];

        for (const mentee of mentees) {
            const attendance = await this.getAttendanceCount(mentee.id, startDate);
            const courseProgress = await this.getCourseProgressScore(mentee.id, startDate);
            const projectsCompleted = await this.getCompletedTasksCount(mentee.id, startDate);

            // Weighted overall score (you can adjust weights as needed)
            const overallScore = (attendance * 2) + (courseProgress * 3) + (projectsCompleted * 5);

            entries.push({
                userId: mentee.id,
                firstName: mentee.firstName,
                lastName: mentee.lastName,
                profilePicture: mentee.profilePicture,
                score: overallScore,
                rank: 0,
                attendanceSessions: attendance,
                courseProgress: courseProgress,
                projectsCompleted: projectsCompleted
            });
        }

        if (previousStartDate) {
            await this.calculateRankChanges(entries, previousStartDate, startDate, 'overall');
        }

        return entries;
    }

    private async getAttendanceCount(userId: string, startDate: Date | null, endDate?: Date | null): Promise<number> {
        const whereClause: any = { user: { id: userId } };

        if (startDate) {
            whereClause.createdAt = {};
            if (endDate) {
                whereClause.createdAt = { gte: startDate, lt: endDate };
            } else {
                whereClause.createdAt = { gte: startDate };
            }
        }

        return this.sessionRepository.count({ where: whereClause });
    }

    private async getCourseProgressScore(userId: string, startDate: Date | null): Promise<number> {
        // For now, we'll base course progress on completed tasks
        // In a real implementation, track lesson completions
        const whereClause: any = {
            assignedTo: { id: userId },
            status: TaskStatus.COMPLETED
        };

        if (startDate) {
            whereClause.updatedAt = { gte: startDate };
        }

        return this.taskRepository.count({ where: whereClause });
    }

    private async getCompletedTasksCount(userId: string, startDate: Date | null): Promise<number> {
        const whereClause: any = {
            assignedTo: { id: userId },
            status: TaskStatus.COMPLETED
        };

        if (startDate) {
            whereClause.updatedAt = { gte: startDate };
        }

        return this.taskRepository.count({ where: whereClause });
    }

    private async calculateRankChanges(
        entries: LeaderboardEntry[],
        previousStartDate: Date,
        currentStartDate: Date | null,
        category: string
    ): Promise<void> {
        // Get previous rankings for comparison
        // This is a simplified implementation - in production, you'd want to cache these
        const previousEntries = await this.getPreviousPeriodRankings(
            entries.map(e => e.userId),
            previousStartDate,
            currentStartDate,
            category
        );

        entries.forEach(entry => {
            const previousEntry = previousEntries.find(p => p.userId === entry.userId);
            if (previousEntry) {
                entry.previousRank = previousEntry.rank;
                entry.rankChange = previousEntry.rank - entry.rank; // Positive = improvement
            }
        });
    }

    private async getPreviousPeriodRankings(
        userIds: string[],
        startDate: Date,
        endDate: Date | null,
        category: string
    ): Promise<{ userId: string; rank: number }[]> {
        // This is a simplified version - calculate rankings for the previous period
        // Implementation would be similar to the main leaderboard logic
        return []; // Placeholder
    }

    private getPeriodDates(period: LeaderboardPeriod): {
        startDate: Date | null;
        previousStartDate: Date | null
    } {
        const now = new Date();

        switch (period) {
            case LeaderboardPeriod.WEEK:
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);

                const previousWeekStart = new Date(startOfWeek);
                previousWeekStart.setDate(startOfWeek.getDate() - 7);

                return {
                    startDate: startOfWeek,
                    previousStartDate: previousWeekStart
                };

            case LeaderboardPeriod.MONTH:
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

                return {
                    startDate: startOfMonth,
                    previousStartDate: previousMonthStart
                };

            case LeaderboardPeriod.ALL_TIME:
                return {
                    startDate: null,
                    previousStartDate: null
                };

            default:
                return {
                    startDate: null,
                    previousStartDate: null
                };
        }
    }
}