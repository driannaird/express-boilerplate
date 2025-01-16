import Joi from "joi";

export const createDummyValidation = (payload: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  return schema.validate(payload);
};

export const updateDummyValidation = (payload: any) => {
  const schema = Joi.object({
    name: Joi.string(),
  }).min(1);

  return schema.validate(payload);
};
