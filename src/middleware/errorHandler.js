import { logger } from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  // Unique constraint violation
  switch (err.code) {
    case "P2002":
      const field = err.meta.target
        .replace(/^.*?_/, "")
        .replace(/_key$/, "")
        .replace("_", "");

      logger.error(
        `${field} yang Anda masukkan sudah terdaftar. Silakan gunakan data lain.`
      );
      res.status(400).json({
        message: `${field} yang Anda masukkan sudah terdaftar. Silakan gunakan data lain.`,
      });
      break;
    case "P2025":
      logger.error(
        "Data dengan parameter tersebut tidak tersedia. Proses tidak dapat di lanjutkan."
      );
      res.status(400).json({
        message:
          "Data dengan parameter tersebut tidak tersedia. Proses tidak dapat di lanjutkan.",
      });
      break;
    case "P2003":
      logger.error(
        `${err.meta.field_name} yang anda masukan tidak tersedia. Proses tidak dapat di lanjutkan.`
      );
      res.status(400).json({
        message: `${err.meta.field_name} yang anda masukan tidak tersedia. Proses tidak dapat di lanjutkan.`,
      });
      break;
    case "P1001":
      logger.error("Koneksi Database error");
      res.status(500).json({
        message: "Koneksi Database error",
      });
      break;

    default:
      logger.error(err);
      res.status(500).json({
        message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
      });
      break;
  }
};

export default errorHandler;
