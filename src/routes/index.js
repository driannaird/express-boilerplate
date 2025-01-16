import { Router } from "express";

import DummyRouter from "../domain/dummy/routes.js";

const router = Router();

router.use("/dummy", DummyRouter);

export default router;
