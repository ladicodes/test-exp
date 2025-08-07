import express from "express";
import profileRoutes from "./api/v1/profile";
import routes from "./api";

const router = express.Router();

router.use("/api", routes);
router.use("/api/v1/profile", profileRoutes);

export default router;
