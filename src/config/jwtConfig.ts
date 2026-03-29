import "dotenv/config";

const CONFIG = {
  jwt_secret: process.env.JWT_SECRET || "development-secret-change-me",
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "3d",
};

export default CONFIG;
