import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { logger } from "../../utils/logger";
import { ResponseError } from "../../utils/http-error";
import {
  changePasswordService,
  createUserService,
  deleteUserService,
  getAllUserService,
  getCountUserService,
  getUserByUniqueIdService,
  updateOwnProfileService,
  updateUserService,
} from "./service";
import {
  changePasswordValidation,
  createUserValidation,
  updateMeValidation,
  updateUserValidation,
  userListQueryValidation,
} from "./validation";

export const getAllUser = async (
  req: Request<
    {},
    {},
    {},
    { search?: string; page?: string; limit?: string; sort?: string }
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error: queryError } = userListQueryValidation(req.query);

  if (queryError) {
    next(new ResponseError(400, queryError.details[0].message));
    return;
  }

  const search = req.query.search || "";
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (page - 1) * limit;
  const sortValue = req.query.sort;
  const sort =
    sortValue === "asc" || sortValue === "desc" || sortValue === "last-login"
      ? sortValue
      : undefined;

  try {
    const totalRows = await getCountUserService(search);
    const pageTotal = Math.ceil(totalRows / limit);
    const users = await getAllUserService(search, skip, limit, sort);

    logger.info("Success get all users");
    res.status(200).json({
      status: true,
      message: "Success get all users",
      page,
      limit,
      totalRows,
      pageTotal,
      datas: users,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const getUserByUniqueId = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await getUserByUniqueIdService(req.params.id);

    if (!user) {
      next(new ResponseError(404, "User not found"));
      return;
    }

    logger.info(`Success get user ${req.params.id}`);
    res.status(200).json({
      status: true,
      message: "Success get user",
      data: user,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error, value } = createUserValidation(req.body);

  if (error) {
    next(new ResponseError(422, error.details[0].message));
    return;
  }

  try {
    const user = await createUserService(value);

    logger.info(`Success create user ${user.id}`);
    res.status(201).json({
      status: true,
      message: "Success create user",
      data: user,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error, value } = updateUserValidation(req.body);

  if (error) {
    next(new ResponseError(422, error.details[0].message));
    return;
  }

  try {
    const user = await updateUserService(req.params.id, value);

    logger.info(`Success update user ${req.params.id}`);
    res.status(200).json({
      status: true,
      message: "Success update user",
      data: user,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await deleteUserService(req.params.id);

    logger.info(`Success delete user ${req.params.id}`);
    res.status(200).json({
      status: true,
      message: "Success delete user",
      data: user,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      next(new ResponseError(401, "Unauthorized"));
      return;
    }

    const user = await getUserByUniqueIdService(req.userId);

    if (!user) {
      next(new ResponseError(404, "User not found"));
      return;
    }

    res.status(200).json({
      status: true,
      message: "Success get profile",
      data: user,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error, value } = updateMeValidation(req.body);

  if (error) {
    next(new ResponseError(422, error.details[0].message));
    return;
  }

  try {
    if (!req.userId) {
      next(new ResponseError(401, "Unauthorized"));
      return;
    }

    const user = await updateOwnProfileService(req.userId, value);

    res.status(200).json({
      status: true,
      message: "Success update profile",
      data: user,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const updateMyPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error, value } = changePasswordValidation(req.body);

  if (error) {
    next(new ResponseError(422, error.details[0].message));
    return;
  }

  try {
    if (!req.userId) {
      next(new ResponseError(401, "Unauthorized"));
      return;
    }

    await changePasswordService(
      req.userId,
      value.currentPassword,
      value.newPassword
    );

    res.status(200).json({
      status: true,
      message: "Success update password",
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};
