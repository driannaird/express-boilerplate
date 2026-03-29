import { NextFunction, Request, Response } from "express";
import { ResponseError } from "../utils/http-error";

const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new ResponseError(404, `Route ${req.method} ${req.originalUrl} not found`));
};

export default notFoundHandler;
