import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { ResponseError } from "../utils/http-error";

interface ErrorMeta {
  target?: string | string[];
  field_name?: string;
  constraint?: string[];
}

interface AppError extends Error {
  code?: string;
  meta?: ErrorMeta;
  status?: number;
  type?: string;
}

const parsePrismaField = (target?: string | string[]) => {
  if (Array.isArray(target)) {
    return target.join(", ");
  }

  return target?.replace(/^.*?_/, "").replace(/_key$/, "").replace("_", "");
};

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!err) {
    next();
    return;
  }

  if (res.headersSent) {
    next(err);
    return;
  }

  if (err.type === "entity.parse.failed") {
    logger.error("Payload JSON tidak valid.");
    res.status(400).json({
      status: false,
      message: "Payload JSON tidak valid.",
    });
    return;
  }

  switch (err.code) {
    case "P2002":
      const field = parsePrismaField(err.meta?.target) || "Data";

      logger.error(
        `${field} yang Anda masukkan sudah terdaftar. Silakan gunakan data lain.`
      );
      res.status(400).json({
        status: false,
        message: `${field} yang Anda masukkan sudah terdaftar. Silakan gunakan data lain.`,
      });
      return;
    case "P2025":
      logger.error(
        "Data dengan parameter tersebut tidak tersedia. Proses tidak dapat di lanjutkan."
      );
      res.status(400).json({
        status: false,
        message:
          "Data dengan parameter tersebut tidak tersedia. Proses tidak dapat di lanjutkan.",
      });
      return;
    case "P2003":
      const relationField = err.meta?.field_name ?? err.meta?.constraint?.[0];

      logger.error(
        `${relationField} yang anda masukan tidak tersedia. Proses tidak dapat di lanjutkan.`
      );
      res.status(400).json({
        status: false,
        message: `${relationField} yang anda masukan tidak tersedia. Proses tidak dapat di lanjutkan.`,
      });
      return;
    case "P1001":
      logger.error("Koneksi Database error");
      res.status(500).json({
        status: false,
        message: "Koneksi Database error",
      });
      return;
    default:
      if (err instanceof ResponseError) {
        logger.error(err.message);
        res.status(err.status).json({
          status: false,
          message: err.message,
        });
        return;
      }

      logger.error(err.message ?? err);
      res.status(err.status ?? 500).json({
        status: false,
        message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
      });
      return;
  }
};

export default errorHandler;
