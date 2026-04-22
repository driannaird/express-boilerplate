import { Router } from "express";
import { requireUser } from "../../middleware/auth";
import {
	enableTwoFactorAuth,
	login,
	register,
	setupTwoFactorAuth,
	verifyTwoFactorLogin,
} from "./controller";

const AuthRouter: Router = Router();

AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
AuthRouter.post("/2fa/setup", requireUser, setupTwoFactorAuth);
AuthRouter.post("/2fa/enable", requireUser, enableTwoFactorAuth);
AuthRouter.post("/2fa/verify", verifyTwoFactorLogin);

export default AuthRouter;
