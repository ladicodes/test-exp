import express from "express";
import { UserController } from "../../../controllers/user/user.controller";
import { AppDataSource } from "../../../utils/data-source";
import { User } from "../../../entities/user/user.entity";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userController = new UserController(userRepository);

router.get("/", userController.getAllUsers.bind(userController));
router.get("/role", userController.getUsersByRole.bind(userController));
router.put("/:id", userController.updateUser.bind(userController));
router.delete("/:id", userController.deleteUser.bind(userController));
router.get("/:id", userController.getUserById.bind(userController));

export default router;
