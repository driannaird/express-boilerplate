import bcrypt from "bcrypt";

export const hashing = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const checkPassword = async (
  password: string,
  userPassword: string
) => {
  return await bcrypt.compare(password, userPassword);
};
