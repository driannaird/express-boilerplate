import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

const transport = isProduction
  ? undefined
  : pino.transport({
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
      },
    });

export const logger = pino(
  {
    base: {
      pid: false,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);
