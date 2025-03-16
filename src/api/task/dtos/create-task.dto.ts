import {
  IsArray,
  IsDefined,
  IsEnum,
  IsMongoId,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { Expose, Type } from "class-transformer";
import { Task, TaskStatus } from "../../../database/schema/task.schema";

class IdObject {
  @Expose()
  @IsMongoId()
  @IsDefined()
  @IsString()
  id: string;
}

export class CreateTaskDto implements Omit<Task, "users" | "createdAt"> {
  @Expose()
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdObject)
  users: IdObject[];

  @Expose()
  @IsDefined()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(50)
  name: string;
}
