import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import logger from "./utils/logger";
import { errorMiddleware } from "./middleware/error.middleware";
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import swaggerDocument from "../swagger.json";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);

// Performance middleware
app.use(compression());

// Logging
app.use(
  morgan("short", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Body parsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.use("/", routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler (must be last)
app.use(errorMiddleware);

export default app;
