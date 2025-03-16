import { faker } from "@faker-js/faker";
import { UserDocument, UserModel } from "../schema/user.schema";
import { ProjectDocument, ProjectModel } from "../schema/project.schema";
import { TaskDocument, TaskModel, TaskStatus } from "../schema/task.schema";

class InitialSeeder {
  async shouldRun(): Promise<boolean> {
    console.log("Checking if seeding is required");

    const [[usersCount], [projectsCount], [tasksCount]]: { total: number }[][] =
      await Promise.all([
        UserModel.aggregate([{ $count: "total" }]),
        ProjectModel.aggregate([{ $count: "total" }]),
        TaskModel.aggregate([{ $count: "total" }]),
      ]);

    return !usersCount?.total || !projectsCount?.total || !tasksCount?.total;
  }

  async run() {
    const shouldRun = await this.shouldRun();

    if (!shouldRun) {
      console.log("Database already up-to-date");
      return;
    }

    console.log("Seeding database");
    const projectsToGenerate = 5;
    const usersPerTask = 2;
    const tasksPerProject = 3;

    try {
      await Promise.all([
        UserModel.collection.drop(),
        TaskModel.collection.drop(),
        ProjectModel.collection.drop(),
      ]);

      await Promise.all(
        new Array(projectsToGenerate).fill(null).map(async () => {
          const projectUsers: UserDocument[] = [];

          const tasks = await Promise.all(
            new Array(tasksPerProject).fill(null).map(async () => {
              const taskUsers = await Promise.all(
                new Array(usersPerTask).fill(null).map(() => this.createUser())
              );
              projectUsers.push(...taskUsers);
              return this.createTask(taskUsers);
            })
          );

          return this.createProject(projectUsers, tasks);
        })
      );

      console.log("Seeding completed");
    } catch (error) {
      console.log(`Seeding has failed. Terminating. Cause: ${error}`);
      process.exit(1);
    }
  }

  async createUser(): Promise<UserDocument> {
    const fakePerson = faker.person;
    const user = await UserModel.create({
      name: fakePerson.firstName(),
      surname: fakePerson.lastName(),
    });

    return user;
  }

  async createTask(users: UserDocument[]): Promise<TaskDocument> {
    return TaskModel.create({
      users: users.map((it) => it._id),
      status:
        Object.values(TaskStatus)[
          faker.number.int({ min: 0, max: Object.values(TaskStatus).length })
        ],
      name: faker.food.ingredient(),
    });
  }

  async createProject(
    users: UserDocument[],
    tasks: TaskDocument[]
  ): Promise<ProjectDocument> {
    return ProjectModel.create({
      name: faker.commerce.productName(),
      tasks: tasks.map((it) => it._id),
      users: users.map((it) => it._id),
    });
  }
}

export default InitialSeeder;
