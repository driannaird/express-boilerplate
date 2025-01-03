import express from "express";
import router from "./routes/index.js";

const createServer = () => {
  const app = express();

  app.use("/api/v1", router);

  return app;
};

export default createServer;
