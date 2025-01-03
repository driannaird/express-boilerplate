import { Router } from "express";
import PasienRouter from "../domain/pasien/routes";
import testMiddleware from "../middleware/test";

const router = Router();

router.use("/pasien", testMiddleware, PasienRouter);

export default router;
