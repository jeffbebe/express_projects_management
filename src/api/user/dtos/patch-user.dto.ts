import { IsOptional, IsString, MaxLength } from "class-validator";
import { Expose } from "class-transformer";
import { User } from "../../../database/schema/user.schema";

export class PatchUserDto implements Partial<Pick<User, "name" | "surname">> {
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  surname?: string;
}
