import "dotenv/config";

const CONFIG = {
  jwt_public: process.env.JWT_PUBLIC || "",
  jwt_private: process.env.JWT_PRIVATE || "",
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "3d",
};

export default CONFIG;
