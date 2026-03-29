import express, { Application } from "express";
import router from "./routes";
import dotenv from "dotenv";
import checkConnection from "./config/checkConnectionDB";
import errorHandler from "./middleware/errorHandler";
import deserializeToken from "./middleware/deserializeToken";

const createServer = () => {
  dotenv.config();
  checkConnection();

  const app: Application = express();

  // parse body request
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(deserializeToken);

  app.use("/api/v1", router);

  app.use(errorHandler);

  return app;
};

export default createServer;
