import express from "express";
import { UserController } from "../../../controllers/user/user.controller";
import { AppDataSource } from "../../../utils/data-source";
import { User } from "../../../entities/user/user.entity";
import { authMiddleware } from "../../../middleware/auth.middleware";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userController = new UserController(userRepository);

router.get(
  "/",
  authMiddleware,
  userController.getAllUsers.bind(userController)
);

router.get(
  "/info",
  authMiddleware,
  userController.getUserInfo.bind(userController)
);

router.get(
  "/role",
  authMiddleware,
  userController.getUsersByRole.bind(userController)
);

router.patch(
  "/info",
  authMiddleware,
  userController.updateUser.bind(userController)
);

router.patch(
  "/profile-picture",
  authMiddleware,
  userController.getProfilePictureUpload(),
  userController.updateProfilePicture.bind(userController)
);

router.delete(
  "/:id",
  authMiddleware,
  userController.deleteUser.bind(userController)
);

router.get(
  "/:id",
  authMiddleware,
  userController.getUserById.bind(userController)
);

export default router;
