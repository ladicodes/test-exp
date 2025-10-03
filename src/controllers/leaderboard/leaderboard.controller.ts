import { Request, Response } from "express";
import { Repository } from "typeorm";
import { LeaderboardService, LeaderboardCategory, LeaderboardPeriod } from "../../services/leaderboard.service";
import { ResponseUtil } from "../../utils/response";
import { User } from "../../entities/user/user.entity";
import { Session } from "../../entities/session/session.entity";
import { Task } from "../../entities/tasks/task.entity";
import { Course } from "../../entities/course/course.entity";

export class LeaderboardController {
    private readonly leaderboardService: LeaderboardService;

    constructor(
        userRepository: Repository<User>,
        sessionRepository: Repository<Session>,
        taskRepository: Repository<Task>,
        courseRepository: Repository<Course>,
    ) {
        this.leaderboardService = new LeaderboardService(
            userRepository,
            sessionRepository,
            taskRepository,
            courseRepository,
        );
    }

    async getLeaderboard(req: Request, res: Response): Promise<Response> {
        try {
            const {
                category = LeaderboardCategory.OVERALL,
                period = LeaderboardPeriod.ALL_TIME,
                limit = 50
            } = req.query;

            // Validate category
            if (!Object.values(LeaderboardCategory).includes(category as LeaderboardCategory)) {
                return ResponseUtil.error(
                    res,
                    `Invalid category. Must be one of: ${Object.values(LeaderboardCategory).join(', ')}`,
                    400
                );
            }

            // Validate period
            if (!Object.values(LeaderboardPeriod).includes(period as LeaderboardPeriod)) {
                return ResponseUtil.error(
                    res,
                    `Invalid period. Must be one of: ${Object.values(LeaderboardPeriod).join(', ')}`,
                    400
                );
            }

            // Validate limit
            const limitNumber = parseInt(limit as string);
            if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
                return ResponseUtil.error(
                    res,
                    "Limit must be a number between 1 and 100",
                    400
                );
            }

            const leaderboard = await this.leaderboardService.getLeaderboard(
                category as LeaderboardCategory,
                period as LeaderboardPeriod,
                limitNumber
            );

            return ResponseUtil.success(
                res,
                leaderboard,
                "Leaderboard retrieved successfully"
            );
        } catch (error) {
            return ResponseUtil.error(
                res,
                "Error retrieving leaderboard",
                500,
                error
            );
        }
    }


    async getUserRanking(req: Request, res: Response): Promise<Response> {
        try {
            // @ts-ignore
            const userId = req.user?.id;
            if (!userId) {
                return ResponseUtil.error(res, "User not authenticated", 401);
            }

            const {
                category = LeaderboardCategory.OVERALL,
                period = LeaderboardPeriod.ALL_TIME
            } = req.query;

            if (!Object.values(LeaderboardCategory).includes(category as LeaderboardCategory)) {
                return ResponseUtil.error(
                    res,
                    `Invalid category. Must be one of: ${Object.values(LeaderboardCategory).join(', ')}`,
                    400
                );
            }

            if (!Object.values(LeaderboardPeriod).includes(period as LeaderboardPeriod)) {
                return ResponseUtil.error(
                    res,
                    `Invalid period. Must be one of: ${Object.values(LeaderboardPeriod).join(', ')}`,
                    400
                );
            }

            // Get the full leaderboard and find user's position
            const leaderboard = await this.leaderboardService.getLeaderboard(
                category as LeaderboardCategory,
                period as LeaderboardPeriod,
                1000 // Get a large number to find user's position
            );

            const userEntry = leaderboard.entries.find(entry => entry.userId === userId);

            if (!userEntry) {
                return ResponseUtil.error(res, "User not found in leaderboard", 404);
            }

            return ResponseUtil.success(
                res,
                {
                    userRanking: userEntry,
                    totalEntries: leaderboard.totalEntries
                },
                "User ranking retrieved successfully"
            );
        } catch (error) {
            return ResponseUtil.error(
                res,
                "Error retrieving user ranking",
                500,
                error
            );
        }
    }
}

