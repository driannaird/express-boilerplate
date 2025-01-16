import { logger } from "../utils/logger";
import prisma from "../utils/prismaClient";

async function checkConnection() {
  try {
    await prisma.$connect();
    logger.info("Connection Database Success!");
  } catch (error) {
    logger.error("Connection Database Error With:", error);
    process.exit(1);
  }
}

export default checkConnection;