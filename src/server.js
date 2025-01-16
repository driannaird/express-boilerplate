import express from "express";
import router from "./routes/index.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import errorHandler from "./middleware/errorHandler.js";
import checkConnection from "./config/checkConnectionDB.js";

const createServer = () => {
  dotenv.config();
  checkConnection();

  const app = express();

  // parse body request
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use("/api/v1", router);

  app.use(errorHandler);

  return app;
};

export default createServer;
