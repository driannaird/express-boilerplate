import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";

const deserializeToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization || "";
  const accessToken = header.startsWith("Bearer ")
    ? header.substring(7)
    : undefined;

  if (!accessToken) {
    next();
    return;
  }

  const token = verifyJWT(accessToken);

  if (token.decoded) {
    res.locals.user = token.decoded as Express.Locals["user"];
    req.userId = (token.decoded as { id: string }).id;
  }

  next();
};

export default deserializeToken;
