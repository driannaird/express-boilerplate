import { NextFunction, Request, Response } from "express";
import { logger } from "../../utils/logger";
import { ResponseError } from "../../utils/http-error";
import { checkPassword } from "../../utils/hashing";
import { signJWT } from "../../utils/jwt";
import {
  getUserByEmailService,
  registerUserService,
  updateLastLoginService,
} from "../user/service";
import {
  createSessionValidation,
  registerValidation,
} from "./validation";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error, value } = registerValidation(req.body);

  if (error) {
    next(new ResponseError(422, error.details[0].message));
    return;
  }

  try {
    const user = await registerUserService(value);

    logger.info(`Success register user ${user.id}`);
    res.status(201).json({
      status: true,
      message: "Register success",
      data: user,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error, value } = createSessionValidation(req.body);

  if (error) {
    next(new ResponseError(422, error.details[0].message));
    return;
  }

  try {
    const user = await getUserByEmailService(value.email);

    if (!user) {
      next(new ResponseError(401, "Wrong email or password"));
      return;
    }

    const isValid = await checkPassword(value.password, user.password);

    if (!isValid) {
      next(new ResponseError(401, "Wrong email or password"));
      return;
    }

    const token = signJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    try {
      await updateLastLoginService(user.id);
    } catch (error) {
      logger.error(`Failed updating last login for ${user.id}`);
    }

    logger.info(`Login success for user ${user.id}`);
    res.status(200).json({
      status: true,
      message: "Login success",
      data: {
        token,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};
