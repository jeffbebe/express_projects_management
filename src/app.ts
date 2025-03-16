import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import { notFoundHandler } from "./common/middleware/not-found.handler";
import { env } from "./common/utils/env.config";
import { projectRouter } from "./api/project/project.routes";
import { userRoutes } from "./api/user/user.routes";
import errorHandler from "./common/middleware/error.handler";
import { taskRoutes } from "./api/task/task.routes";

const app: Express = express();

app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());

app.use("/projects", projectRouter);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
