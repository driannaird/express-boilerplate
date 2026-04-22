import Joi from "joi";

export const registerValidation = (payload: unknown) => {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  return schema.validate(payload);
};

export const createSessionValidation = (payload: unknown) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  return schema.validate(payload);
};

export const verifyTwoFactorValidation = (payload: unknown) => {
  const schema = Joi.object({
    challengeToken: Joi.string().required(),
    otp: Joi.string().pattern(/^\d{6}$/).required(),
  });

  return schema.validate(payload);
};

export const enableTwoFactorValidation = (payload: unknown) => {
  const schema = Joi.object({
    otp: Joi.string().pattern(/^\d{6}$/).required(),
  });

  return schema.validate(payload);
};
