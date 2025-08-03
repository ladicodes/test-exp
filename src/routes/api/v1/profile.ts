import express from "express";
import controller from "../../../controllers/profile/profile.controller";
import { AppDataSource } from "../../../utils/data-source";
import { Profile } from "../../../entities/profile/profile.entity";

const router = express.Router();

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
