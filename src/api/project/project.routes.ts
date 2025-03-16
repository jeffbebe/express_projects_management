import { Router } from "express";
import { ProjectController } from "./project.controller";

export const projectRouter = Router();
const projectController = new ProjectController();

projectRouter.get("/", projectController.getProjects);
