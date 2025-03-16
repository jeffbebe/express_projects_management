import { Schema, Document, MergeType, model } from "mongoose";
import { TASK_COLLECTION_NAME } from "./task.schema";
import { USER_COLLECTION_NAME } from "./user.schema";

export const PROJECT_COLLECTION_NAME = "Project";

export interface Project {
  name: string;
  tasks: { id: string }[];
  users: { id: string }[];
  createdAt: Date;
}

export interface ProjectDocument extends MergeType<Document, Project> {}

const ProjectSchema = new Schema<ProjectDocument>({
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: TASK_COLLECTION_NAME,
      required: true,
    },
  ],
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    },
  ],

  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const ProjectModel = model<ProjectDocument>(
  PROJECT_COLLECTION_NAME,
  ProjectSchema
);
