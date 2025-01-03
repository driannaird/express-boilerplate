import { NextFunction, Request, Response } from "express";

const testMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("anjir work middleware");

  next();
};

export default testMiddleware;
