import { Router } from "express";
import {
  createDummy,
  deleteDummy,
  getAllDummy,
  getDummyByUniqueId,
  updateDummy,
} from "./controller.js";

const DummyRouter = Router();

DummyRouter.get("/", getAllDummy);
DummyRouter.get("/:id", getDummyByUniqueId);
DummyRouter.post("/", createDummy);
DummyRouter.patch("/:id", updateDummy);
DummyRouter.delete("/:id", deleteDummy);

export default DummyRouter;
