import { Router } from "express";
import { login, register } from "./controller";

const AuthRouter: Router = Router();

AuthRouter.post("/register", register);
AuthRouter.post("/login", login);

export default AuthRouter;
