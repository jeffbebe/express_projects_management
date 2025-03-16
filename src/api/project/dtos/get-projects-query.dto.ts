import { Expose, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../../../database/schema/task.schema";

export class GetProjectsQueryDto {
  @Expose()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  groupStatus?: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  search?: string;

  @Expose()
  @IsOptional()
  @IsEnum(TaskStatus)
  allStatusesAs?: TaskStatus;

  @Expose()
  @IsOptional()
  @Type(() => Date)
  dateFrom?: Date;

  @Expose()
  @IsOptional()
  @Type(() => Date)
  dateTo?: Date;
}
