import express, { Application } from "express";
import router from "./routes";

const createServer = () => {
  const app: Application = express();

  app.use("/api/v1", router)

  return app;
};

export default createServer;
