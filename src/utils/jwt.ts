import jwt, { SignOptions } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import CONFIG from "../config/jwtConfig";

interface SignJWTPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface LoginChallengePayload extends SignJWTPayload {
  purpose: "2fa_challenge";
}

export const signJWT = (
  payload: SignJWTPayload,
  options?: SignOptions
) => {
  return jwt.sign(payload, CONFIG.jwt_private, {
    algorithm: "RS256" as const,
    expiresIn: CONFIG.jwt_expires_in as SignOptions["expiresIn"],
    ...(options || {}),
  });
};

export const signLoginChallengeJWT = (
  payload: SignJWTPayload,
  options?: SignOptions
) => {
  const challengePayload: LoginChallengePayload = {
    ...payload,
    purpose: "2fa_challenge",
  };

  return jwt.sign(challengePayload, CONFIG.jwt_private, {
    algorithm: "RS256" as const,
    expiresIn: "5m",
    ...(options || {}),
  });
};

export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, CONFIG.jwt_public);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error) {
    return {
      valid: false,
      expired: error instanceof jwt.TokenExpiredError,
      decoded: null,
    };
  }
};
