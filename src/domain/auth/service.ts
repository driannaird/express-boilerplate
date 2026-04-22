import { UserRole } from "@prisma/client";
import { ResponseError } from "../../utils/http-error";
import { checkPassword, hashing } from "../../utils/hashing";
import {
  signJWT,
  signLoginChallengeJWT,
  verifyJWT,
} from "../../utils/jwt";
import {
  generateOtpAuthUrl,
  generateTwoFactorSecret,
  verifyTwoFactorCode,
} from "../../utils/twoFactor";
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

  if (user.twoFactorEnabled) {
    if (!user.twoFactorSecret) {
      throw new ResponseError(400, "2FA not configured");
    }

    const challengeToken = signLoginChallengeJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return {
      twoFactorRequired: true,
      challengeToken,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
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
    twoFactorRequired: false,
    token,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const setupTwoFactorAuthService = async (userId: string) => {
  const user = await UserRepository.findUniqueIdWithPassword(userId);

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  if (user.twoFactorEnabled) {
    throw new ResponseError(400, "2FA already enabled");
  }

  const secret = generateTwoFactorSecret();
  const otpauthUrl = generateOtpAuthUrl(user.email, secret);

  await UserRepository.update(user.id, {
    twoFactorEnabled: false,
    twoFactorSecret: secret,
    twoFactorConfirmedAt: null,
  });

  return {
    secret,
    otpauthUrl,
    twoFactorEnabled: false,
  };
};

export const enableTwoFactorAuthService = async (
  userId: string,
  otp: string
) => {
  const user = await UserRepository.findUniqueIdWithPassword(userId);

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  if (!user.twoFactorSecret) {
    throw new ResponseError(400, "2FA secret not found");
  }

  if (user.twoFactorEnabled) {
    throw new ResponseError(400, "2FA already enabled");
  }

  const isValid = verifyTwoFactorCode(otp, user.twoFactorSecret);

  if (!isValid) {
    throw new ResponseError(400, "Invalid OTP");
  }

  const confirmedAt = new Date();

  await UserRepository.update(user.id, {
    twoFactorEnabled: true,
    twoFactorConfirmedAt: confirmedAt,
  });

  return {
    twoFactorEnabled: true,
    twoFactorConfirmedAt: confirmedAt,
  };
};

export const verifyTwoFactorLoginService = async (payload: {
  challengeToken: string;
  otp: string;
}) => {
  const token = verifyJWT(payload.challengeToken);

  if (!token.valid || !token.decoded) {
    throw new ResponseError(401, "Invalid or expired challenge token");
  }

  const decoded = token.decoded as {
    id?: string;
    purpose?: string;
  };

  if (decoded.purpose !== "2fa_challenge" || !decoded.id) {
    throw new ResponseError(401, "Invalid challenge token");
  }

  const user = await UserRepository.findUniqueIdWithPassword(decoded.id);

  if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
    throw new ResponseError(400, "2FA not configured");
  }

  const isValid = verifyTwoFactorCode(payload.otp, user.twoFactorSecret);

  if (!isValid) {
    throw new ResponseError(400, "Invalid OTP");
  }

  const accessToken = signJWT({
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
    token: accessToken,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};
