import createServer from "./server";
import { logger } from "./utils/logger";

const app = createServer();
const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, (error?: Error) => {
  if (error) {
    logger.error(error.message);
    process.exit(1);
  }

  logger.info(`Server is listen on http://localhost:${PORT}`);
});
