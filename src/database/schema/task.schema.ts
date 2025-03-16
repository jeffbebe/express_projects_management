import { Schema, Document, ObjectId, MergeType, model } from "mongoose";
import { USER_COLLECTION_NAME } from "./user.schema";

export const TASK_COLLECTION_NAME = "Task";

export enum TaskStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ON_HOLD = "ON_HOLD",
}

export interface Task {
  users: { id: ObjectId }[];
  status: TaskStatus;
  name: string;
  createdAt: Date;
}

export interface TaskDocument extends MergeType<Document, Task> {}

const TaskSchema = new Schema<TaskDocument>({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    },
  ],

  status: {
    type: String,
    enum: TaskStatus,
    required: true,
    default: TaskStatus.ON_HOLD,
  },
  createdAt: { type: Date, default: Date.now },
});

export const TaskModel = model<TaskDocument>(TASK_COLLECTION_NAME, TaskSchema);
