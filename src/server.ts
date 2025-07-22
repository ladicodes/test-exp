import app from "./app";
import { config } from "./config/environment";
import { AppDataSource } from "./utils/data-source";
import logger from "./utils/logger";

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Database connection established");

    const server = app.listen(config.port, () => {
      logger.info(
        `Server running on port ${config.port} in ${config.nodeEnv} mode`
      );
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received, shutting down gracefully");
      server.close(() => {
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
