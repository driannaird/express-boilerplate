import { Router } from "express";

import AuthRouter from "../domain/auth/routes";
import DummyRouter from "../domain/dummy/routes";
import UserRouter from "../domain/user/routes";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/dummy", DummyRouter);
router.use("/users", UserRouter);

export default router;
