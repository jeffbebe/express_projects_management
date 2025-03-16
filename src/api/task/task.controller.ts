import { NextFunction, Request, Response } from "express";
import { validateRequestPayload } from "../../common/middleware/validate-body.validator";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { taskService } from "./task.service";

export class TaskController {
  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = await validateRequestPayload(CreateTaskDto, "body", req);

      const task = await taskService.createTask(payload);

      res.status(201).json(task).end();
    } catch (err) {
      next(err);
    }
  }
}
