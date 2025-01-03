import { Router } from "express";
import PasienRouter from "../domain/pasien/routes.js";
import testMiddleware from "../middleware/test.js";

const router = Router();

router.use("/pasien", testMiddleware, PasienRouter);

export default router;
