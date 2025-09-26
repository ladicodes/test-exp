import express from "express";
import routes from "./api";

const router = express.Router();

router.use("/api", routes);

export default router;
