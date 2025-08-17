import express from "express";
import { ProfileController } from "../../../controllers/profile/profile.controller";
import { AppDataSource } from "../../../utils/data-source";
import { Profile } from "../../../entities/profile/profile.entity";
import { authMiddleware } from "../../../middleware/auth.middleware";

const router = express.Router();

const profileRepository = AppDataSource.getRepository(Profile);
const profileController = new ProfileController(profileRepository);

// Guarded Routes
router.use(authMiddleware); // Apply JWT middleware to all below

// create a new profile entry
router.post("/", authMiddleware, profileController.createProfile.bind(profileController));

// get all profile entries
router.get("/:id", authMiddleware, profileController.getProfileById.bind(profileController));

// update a profile entry by id
router.put("/:id", authMiddleware, profileController.updateProfile.bind(profileController));

/* // delete a profile entry by id */
/* router.delete("/:id", authMiddleware profileController./* controller has not been created .bind(profileController)); */

export default router;
