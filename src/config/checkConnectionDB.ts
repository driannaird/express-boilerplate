import { logger } from "../utils/logger";
import prisma from "../utils/prismaClient";

async function checkConnection() {
  try {
    await prisma.$connect();
    logger.info("Connection Database Success!");
  } catch (error) {
    logger.error({ error }, "Connection Database Error");
    throw error;
  }
}

export default checkConnection;
