import express from "express";
import { ProfileController } from "../../../controllers/profile/profile.controller";
import { AppDataSource } from "../../../utils/data-source";
import { Profile } from "../../../entities/profile/profile.entity";
import {authenticateAndAuthorize, authMiddleware} from "../../../middleware/auth.middleware";
import {UserRole} from "../../../entities/user/user.entity";

const router = express.Router();

const profileRepository = AppDataSource.getRepository(Profile);
const profileController = new ProfileController(profileRepository);

// Guarded Routes
router.use( authenticateAndAuthorize()); // Apply JWT middleware to all below



router.get("/", authenticateAndAuthorize(), profileController.getAllProfiles.bind(profileController));


// create a new profile entry
router.post("/",authenticateAndAuthorize(), profileController.createProfile.bind(profileController));

// get a profile entry by id
router.get("/:id", authenticateAndAuthorize(), profileController.getProfileById.bind(profileController));



// update a profile entry by id
router.put("/:id",authenticateAndAuthorize(), profileController.updateProfile.bind(profileController));

/* // delete a profile entry by id */
/* router.delete("/:id", authMiddleware profileController./* controller has not been created .bind(profileController)); */

export default router;