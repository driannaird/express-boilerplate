import { NextFunction, Request, Response } from "express";

const asoy2Middle = (req: Request, res: Response, next: NextFunction) => {
  console.log("dua ye mid");

  next();
};

export default asoy2Middle;
