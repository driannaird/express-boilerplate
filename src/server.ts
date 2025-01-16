import express, { Application } from "express";
import router from "./routes";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import checkConnection from "./config/checkConnectionDB";
import errorHandler from "./middleware/errorHandler";

const createServer = () => {
  dotenv.config();
  checkConnection();

  const app: Application = express();

  // parse body request
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use("/api/v1", router);

  app.use(errorHandler);

  return app;
};

export default createServer;
