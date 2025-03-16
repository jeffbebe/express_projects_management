import { NextFunction, Request, Response } from "express";
import { validateRequestPayload } from "../../common/middleware/validate-body.validator";
import { GetProjectsQueryDto } from "./dtos/get-projects-query.dto";
import { projectService } from "./project.service";

export class ProjectController {
  async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = await validateRequestPayload(
        GetProjectsQueryDto,
        "query",
        req
      );

      const result = await projectService.getProjects(payload);

      res.status(200).json(result).end();
    } catch (err) {
      next(err);
    }
  }
}
