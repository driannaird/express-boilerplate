import { UserRole } from "@prisma/client";
import { ResponseError } from "../../utils/http-error";
import { checkPassword, hashing } from "../../utils/hashing";
import { signJWT } from "../../utils/jwt";
import UserRepository from "../user/repository";

export const registerAuthService = async (payload: {
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

export const loginAuthService = async (payload: {
  email: string;
  password: string;
}) => {
  const user = await UserRepository.findUniqueEmail(payload.email);

  if (!user) {
    throw new ResponseError(401, "Wrong email or password");
  }

  const isValid = await checkPassword(payload.password, user.password);

  if (!isValid) {
    throw new ResponseError(401, "Wrong email or password");
  }

  const token = signJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  try {
    await UserRepository.update(user.id, {
      lastLogin: new Date(),
    });
  } catch {
    // Auth flow should still succeed even if lastLogin update fails.
  }

  return {
    token,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};
