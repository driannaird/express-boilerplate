import { Router } from "express";

import DummyRouter from "../domain/dummy/routes";

const router = Router();

router.use("/dummy", DummyRouter);

export default router;
