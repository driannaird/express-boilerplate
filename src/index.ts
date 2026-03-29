import "dotenv/config";
import checkConnection from "./config/checkConnectionDB";
import createServer from "./server";
import { logger } from "./utils/logger";

const PORT: string | number = process.env.PORT || 5000;

const bootstrap = async () => {
  try {
    await checkConnection();

    const app = createServer();

    app.listen(PORT, (error?: Error) => {
      if (error) {
        logger.error(error.message);
        process.exit(1);
      }

      logger.info(`Server is listen on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(
      `Failed to bootstrap server: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    process.exit(1);
  }
};

void bootstrap();
