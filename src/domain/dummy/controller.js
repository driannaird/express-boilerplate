import { logger } from "../../utils/logger.js";
import {
  createDummyService,
  deleteDummyService,
  getAllDummyService,
  getDummyByUniqueIdService,
  updateDummyService,
} from "./service.js";
import { createDummyValidation, updateDummyValidation } from "./validation.js";

export const getAllDummy = async (req, res, next) => {
  try {
    const dummies = await getAllDummyService();

    logger.info("Success get all dummies");
    return res.status(200).json({
      message: "Success get all dummies",
      datas: dummies,
    });
  } catch (error) {
    return next(error);
  }
};

export const getDummyByUniqueId = async (req, res, next) => {
  const { id } = req.params;

  try {
    const dummy = await getDummyByUniqueIdService(id);

    if (!dummy) {
      logger.error(`Dummy not found ${id}`);
      return res.status(404).json({
        message: `Dummy not found`,
      });
    }

    logger.info(`Success get data dummy ${id}`);
    return res.status(200).json({
      message: "Success get data dummy",
      data: dummy,
    });
  } catch (error) {
    return next(error);
  }
};

export const createDummy = async (req, res, next) => {
  const { error, value } = createDummyValidation(req.body);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  try {
    const dummy = await createDummyService(value);

    logger.info(`Success create dummy`);
    return res.status(200).json({
      message: "Success create dummy",
      data: dummy,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateDummy = async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = updateDummyValidation(req.body);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  try {
    const dummy = await updateDummyService(id, value);

    logger.info("Success update dummy");
    return res.status(200).json({
      message: "Success update dummy",
      data: dummy,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteDummy = async (req, res, next) => {
  const { id } = req.params;

  try {
    const dummy = await deleteDummyService(id);

    logger.info("Success delete dummy");
    return res.status(200).json({
      message: "Success delete dummy",
      data: dummy,
    });
  } catch (error) {
    return next(error);
  }
};
