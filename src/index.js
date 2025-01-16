import createServer from "./server.js";
import { logger } from "./utils/logger.js";

const app = createServer();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server is listen on http://localhost:${PORT}`);
});
