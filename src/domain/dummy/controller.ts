import { Request, Response, NextFunction } from "express";

import { logger } from "../../utils/logger";
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
) => {
  try {
    const dummies = await getAllDummyService();

    logger.info("Success get all dummies");
    res.status(200).json({
      message: "Success get all dummies",
      datas: dummies,
    });
  } catch (error) {
    next(error);
  }
};

export const getDummyByUniqueId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const dummy = await getDummyByUniqueIdService(id);

    if (!dummy) {
      logger.error(`Dummy not found ${id}`);
      res.status(404).json({
        message: `Dummy not found`,
      });
    }

    logger.info(`Success get data dummy ${id}`);
    res.status(200).json({
      message: "Success get data dummy",
      data: dummy,
    });
  } catch (error) {
    next(error);
  }
};

export const createDummy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = createDummyValidation(req.body);

  if (error) {
    res.status(422).json({ message: error.details[0].message });
  }

  try {
    const dummy = await createDummyService(value);

    logger.info(`Success create dummy`);
    res.status(200).json({
      message: "Success create dummy",
      data: dummy,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDummy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { error, value } = updateDummyValidation(req.body);

  if (error) {
    res.status(422).json({ message: error.details[0].message });
  }

  try {
    const dummy = await updateDummyService(id, value);

    logger.info("Success update dummy");
    res.status(200).json({
      message: "Success update dummy",
      data: dummy,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDummy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const dummy = await deleteDummyService(id);

    logger.info("Success delete dummy");
    res.status(200).json({
      message: "Success delete dummy",
      data: dummy,
    });
  } catch (error) {
    next(error);
  }
};
