import express from "express";
import {UserController} from "../../../controllers/user/user.controller";
import {AppDataSource} from "../../../utils/data-source";
import {User, UserRole} from "../../../entities/user/user.entity";
import {authenticateAndAuthorize, authMiddleware} from "../../../middleware/auth.middleware";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userController = new UserController(userRepository);

router.get(
    "/",
    authenticateAndAuthorize(UserRole.ADMIN),
    userController.getAllUsers.bind(userController)
);

router.get(
    "/user",
    authenticateAndAuthorize(),
    userController.getUserInfo.bind(userController)
);

router.get(
    "/role",
    authenticateAndAuthorize(),
    userController.getUsersByRole.bind(userController)
);

router.put(
    "/:id",
    authenticateAndAuthorize(),
    userController.updateUser.bind(userController)
);

router.delete(
    "/:id",
    authenticateAndAuthorize(),
    userController.deleteUser.bind(userController)
);

router.get(
    "/:id",
    authenticateAndAuthorize(),
    userController.getUserById.bind(userController)
);

export default router;