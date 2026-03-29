import express, { Application } from "express";
import router from "./routes";
import errorHandler from "./middleware/errorHandler";
import deserializeToken from "./middleware/deserializeToken";
import notFoundHandler from "./middleware/notFoundHandler";

const createServer = () => {
  const app: Application = express();

  // parse body request
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(deserializeToken);

  app.use("/api/v1", router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createServer;
