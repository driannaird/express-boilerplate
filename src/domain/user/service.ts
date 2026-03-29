import { UserRole } from "@prisma/client";
import { ResponseError } from "../../utils/http-error";
import { hashing, checkPassword } from "../../utils/hashing";
import UserRepository from "./repository";

export const getUserByEmailService = async (email: string) => {
  return await UserRepository.findUniqueEmail(email);
};

export const getAllUserService = async (
  search: string,
  skip: number,
  take: number,
  sort?: "asc" | "desc" | "last-login"
) => {
  return await UserRepository.findMany(search, skip, take, sort);
};

export const getCountUserService = async (search: string) => {
  return await UserRepository.count(search);
};

export const getUserByUniqueIdService = async (id: string) => {
  return await UserRepository.findUniqueId(id);
};

export const registerUserService = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const existing = await UserRepository.findUniqueEmail(payload.email);

  if (existing) {
    throw new ResponseError(409, "Email already in use");
  }

  const totalUsers = await UserRepository.countAll();
  const role = totalUsers === 0 ? UserRole.Admin : UserRole.User;
  const hashedPassword = await hashing(payload.password);

  return await UserRepository.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    role,
  });
};

export const createUserService = async (payload: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) => {
  const existing = await UserRepository.findUniqueEmail(payload.email);

  if (existing) {
    throw new ResponseError(409, "Email already in use");
  }

  const hashedPassword = await hashing(payload.password);

  return await UserRepository.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    role: payload.role,
  });
};

export const updateUserService = async (
  id: string,
  payload: Partial<{
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }>
) => {
  const user = await UserRepository.findUniqueId(id);

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  if (payload.email) {
    const existing = await UserRepository.findUniqueEmail(payload.email);

    if (existing && existing.id !== id) {
      throw new ResponseError(409, "Email already in use");
    }
  }

  const updateData: Partial<{
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }> = { ...payload };

  if (payload.password) {
    updateData.password = await hashing(payload.password);
  }

  return await UserRepository.update(id, updateData);
};

export const updateOwnProfileService = async (
  id: string,
  payload: Partial<{
    name: string;
    email: string;
  }>
) => {
  const user = await UserRepository.findUniqueId(id);

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  if (payload.email) {
    const existing = await UserRepository.findUniqueEmail(payload.email);

    if (existing && existing.id !== id) {
      throw new ResponseError(409, "Email already in use");
    }
  }

  return await UserRepository.update(id, payload);
};

export const changePasswordService = async (
  id: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await UserRepository.findUniqueIdWithPassword(id);

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  const isValid = await checkPassword(currentPassword, user.password);

  if (!isValid) {
    throw new ResponseError(400, "Current password incorrect");
  }

  const hashedPassword = await hashing(newPassword);

  return await UserRepository.update(id, {
    password: hashedPassword,
  });
};

export const deleteUserService = async (id: string) => {
  const user = await UserRepository.findUniqueId(id);

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  return await UserRepository.delete(id);
};

export const updateLastLoginService = async (id: string) => {
  return await UserRepository.update(id, {
    lastLogin: new Date(),
  });
};
