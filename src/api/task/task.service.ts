import { CreateTaskDto } from "./dtos/create-task.dto";
import { TaskModel } from "../../database/schema/task.schema";
import { userService, UserService } from "../user/user.service";

export class TaskService {
  constructor(private readonly userService: UserService) {}

  public async createTask({ name, users, status }: CreateTaskDto) {
    const usersDocs = await this.userService.findManyByIds(
      users.map((it) => it.id)
    );

    const task = await TaskModel.create({
      name,
      users: usersDocs.map((it) => it._id),
      status,
    });

    return task;
  }
}

export const taskService = new TaskService(userService);
