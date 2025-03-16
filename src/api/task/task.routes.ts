import { Router } from "express";
import { TaskController } from "./task.controller";

export const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.post("/", taskController.createTask);
