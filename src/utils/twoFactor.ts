import { generateSecret, generateURI, verifySync } from "otplib";

const APP_NAME = process.env.APP_NAME || "2FA-Sample";

export const generateTwoFactorSecret = () => {
  return generateSecret();
};

export const generateOtpAuthUrl = (email: string, secret: string) => {
  return generateURI({
    issuer: APP_NAME,
    label: email,
    secret,
  });
};

export const verifyTwoFactorCode = (token: string, secret: string) => {
  return verifySync({
    token,
    secret,
    epochTolerance: 30,
  }).valid;
};