import { Router } from "express";
import {
  getAllPasien,
  getPasienById,
  createPasien,
  updatePasien,
  deletePasien,
} from "./controller.js";
import asoy2Middle from "../../middleware/asoy2.js";

const PasienRouter = Router();

PasienRouter.use(asoy2Middle);

PasienRouter.get("/", getAllPasien);
PasienRouter.get("/:id", getPasienById);
PasienRouter.post("/", createPasien);
PasienRouter.patch("/:id", updatePasien);
PasienRouter.delete("/:id", deletePasien);

export default PasienRouter;
