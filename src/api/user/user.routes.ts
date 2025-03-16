import { Router } from "express";
import { UserController } from "./user.controller";

export const userRoutes = Router();
const userController = new UserController();

userRoutes.patch("/:userId", userController.patchUser);
