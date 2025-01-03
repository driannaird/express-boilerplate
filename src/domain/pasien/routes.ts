import { Router } from "express";
import {
  getAllPasien,
  getPasienById,
  createPasien,
  updatePasien,
  deletePasien,
} from "./controller";
import asoy2Middle from "../../middleware/asoy2";

const PasienRouter = Router();

PasienRouter.use(asoy2Middle);

PasienRouter.get("/", getAllPasien);
PasienRouter.get("/:id", getPasienById);
PasienRouter.post("/", createPasien);
PasienRouter.patch("/:id", updatePasien);
PasienRouter.delete("/:id", deletePasien);

export default PasienRouter;
