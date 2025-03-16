import { Schema, Document, MergeType, model } from "mongoose";

export const USER_COLLECTION_NAME = "User";

export interface User {
  name: string;
  surname: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends MergeType<Document, User> {}

const UserSchema = new Schema<User>({
  name: { type: String, required: true, maxlength: 50 },
  surname: { type: String, required: true, maxlength: 50 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const UserModel = model<User>(USER_COLLECTION_NAME, UserSchema);
