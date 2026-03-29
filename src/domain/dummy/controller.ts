import { Request, Response, NextFunction } from "express";

import { logger } from "../../utils/logger";
import { ResponseError } from "../../utils/http-error";
import {
  createDummyService,
  deleteDummyService,
  getAllDummyService,
  getDummyByUniqueIdService,
  updateDummyService,
} from "./service";
import { createDummyValidation, updateDummyValidation } from "./validation";

export const getAllDummy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dummies = await getAllDummyService();

    logger.info("Success get all dummies");
    res.status(200).json({
      status: true,
      message: "Success get all dummies",
      datas: dummies,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const getDummyByUniqueId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const dummy = await getDummyByUniqueIdService(id);

    if (!dummy) {
      next(new ResponseError(404, "Dummy not found"));
      return;
    }

    logger.info(`Success get data dummy ${id}`);
    res.status(200).json({
      status: true,
      message: "Success get data dummy",
      data: dummy,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const createDummy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error, value } = createDummyValidation(req.body);

  if (error) {
    next(new ResponseError(422, error.details[0].message));
    return;
  }

  try {
    const dummy = await createDummyService(value);

    logger.info(`Success create dummy`);
    res.status(200).json({
      status: true,
      message: "Success create dummy",
      data: dummy,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const updateDummy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const { error, value } = updateDummyValidation(req.body);

  if (error) {
    next(new ResponseError(422, error.details[0].message));
    return;
  }

  try {
    const dummy = await updateDummyService(id, value);

    logger.info("Success update dummy");
    res.status(200).json({
      status: true,
      message: "Success update dummy",
      data: dummy,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const deleteDummy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const dummy = await deleteDummyService(id);

    logger.info("Success delete dummy");
    res.status(200).json({
      status: true,
      message: "Success delete dummy",
      data: dummy,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};
