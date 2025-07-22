import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import logger from "./utils/logger";
import { errorMiddleware } from "./middleware/error.middleware";
import routes from "./routes";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Performance middleware
app.use(compression());

// Logging
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api", routes);

// Global error handler (must be last)
app.use(errorMiddleware);

export default app;
