import { Router } from "express";
import { requireAdmin, requireUser } from "../../middleware/auth";
import {
  createUser,
  deleteUser,
  getAllUser,
  getMe,
  getUserByUniqueId,
  updateMe,
  updateMyPassword,
  updateUser,
} from "./controller";

const UserRouter: Router = Router();

UserRouter.get("/me", requireUser, getMe);
UserRouter.patch("/me", requireUser, updateMe);
UserRouter.patch("/me/password", requireUser, updateMyPassword);

UserRouter.get("/", requireAdmin, getAllUser);
UserRouter.get("/:id", requireAdmin, getUserByUniqueId);
UserRouter.post("/", requireAdmin, createUser);
UserRouter.patch("/:id", requireAdmin, updateUser);
UserRouter.delete("/:id", requireAdmin, deleteUser);

export default UserRouter;
