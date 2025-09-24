import app from "./app";
import { config } from "./config/environment";
import { emailService } from "./services/email.service";
import { AppDataSource } from "./utils/data-source";
import logger from "./utils/logger";

const startServer = async () => {
  try {
    // Try to initialize database connection
    try {
      await AppDataSource.initialize();
      logger.info("Database connection established successfully");
    } catch (dbError) {
      logger.error("Database connection failed:", dbError);
      logger.warn("Server will start without database connection");
      logger.warn("Some features may not work without database. To fix:");
      logger.warn("1. Install PostgreSQL locally, or");
      logger.warn("2. Use a cloud database (Neon, Supabase, Railway)");
    }

    try {
      const isEmailConnected = await emailService.verifyConnection();
      if (isEmailConnected) {
        logger.info("Email service connected successfully");
      } else {
        logger.warn("Email service connection failed - emails will not be sent");
      }
    } catch (error) {
      logger.warn("Email service unavailable - continuing without email functionality", error);
    }

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
