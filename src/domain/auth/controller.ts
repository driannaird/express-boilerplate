import { NextFunction, Request, Response } from "express";
import { logger } from "../../utils/logger";
import { ResponseError } from "../../utils/http-error";
import {
  enableTwoFactorAuthService,
  loginAuthService,
  setupTwoFactorAuthService,
  registerAuthService,
  verifyTwoFactorLoginService,
} from "./service";
import {
  createSessionValidation,
  enableTwoFactorValidation,
  registerValidation,
  verifyTwoFactorValidation,
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
    const user = await registerAuthService(value);

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
    const user = await loginAuthService(value);

    if (user.twoFactorRequired) {
      logger.info(`2FA challenge issued for user ${user.id}`);
      res.status(200).json({
        status: true,
        message: "Two-factor authentication required",
        data: {
          twoFactorRequired: true,
          challengeToken: user.challengeToken,
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
      return;
    }

    logger.info(`Login success for user ${user.id}`);

    res.status(200).json({
      status: true,
      message: "Login success",
      data: {
        token: user.token,
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

export const setupTwoFactorAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      next(new ResponseError(401, "Unauthorized"));
      return;
    }

    const data = await setupTwoFactorAuthService(req.userId);

    res.status(200).json({
      status: true,
      message: "2FA setup success",
      data,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const enableTwoFactorAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error, value } = enableTwoFactorValidation(req.body);

  if (error) {
    next(new ResponseError(422, error.details[0].message));
    return;
  }

  try {
    if (!req.userId) {
      next(new ResponseError(401, "Unauthorized"));
      return;
    }

    const data = await enableTwoFactorAuthService(req.userId, value.otp);

    res.status(200).json({
      status: true,
      message: "2FA enabled successfully",
      data,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const verifyTwoFactorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error, value } = verifyTwoFactorValidation(req.body);

  if (error) {
    next(new ResponseError(422, error.details[0].message));
    return;
  }

  try {
    const user = await verifyTwoFactorLoginService(value);

    logger.info(`2FA login success for user ${user.id}`);
    res.status(200).json({
      status: true,
      message: "Login success",
      data: {
        token: user.token,
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
