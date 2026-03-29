import Joi from "joi";

export const createUserValidation = (payload: unknown) => {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid("Admin", "User").required(),
  });

  return schema.validate(payload);
};

export const updateUserValidation = (payload: unknown) => {
  const schema = Joi.object({
    name: Joi.string().min(1),
    email: Joi.string().email(),
    password: Joi.string().min(8),
    role: Joi.string().valid("Admin", "User"),
  }).min(1);

  return schema.validate(payload);
};

export const userListQueryValidation = (payload: unknown) => {
  const schema = Joi.object({
    search: Joi.string().allow("").optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    sort: Joi.string().valid("asc", "desc", "last-login").optional(),
  });

  return schema.validate(payload);
};

export const updateMeValidation = (payload: unknown) => {
  const schema = Joi.object({
    name: Joi.string().min(1),
    email: Joi.string().email(),
  }).min(1);

  return schema.validate(payload);
};

export const changePasswordValidation = (payload: unknown) => {
  const schema = Joi.object({
    currentPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
  });

  return schema.validate(payload);
};
