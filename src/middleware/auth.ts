import { NextFunction, Request, Response } from "express";

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (!user) {
    res.status(401).json({
      status: false,
      message: "Unauthorized",
    });
    return;
  }

  next();
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (!user || user.role !== "Admin") {
    res.status(401).json({
      status: false,
      message: "Unauthorized",
    });
    return;
  }

  next();
};
