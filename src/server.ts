import app from "./app";
import { config } from "./config/environment";
import logger from "./utils/logger";
// import { connectDatabase } from "./database/connection";

const startServer = async () => {
  try {
    // Connect to database
    // await connectDatabase();

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
