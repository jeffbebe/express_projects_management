import { PipelineStage } from "mongoose";
import { ProjectModel } from "../../database/schema/project.schema";
import { GetProjectsQueryDto } from "./dtos/get-projects-query.dto";

export class ProjectService {
  public async getProjects(query: GetProjectsQueryDto) {
    return this.getAggregatedProjects(query);
  }

  private async getAggregatedProjects(query: GetProjectsQueryDto) {
    const pipes = [
      this.getTotalTasksCountHelper(),
      this.getTasksLookup(query.allStatusesAs),
      this.getUsersLookup(),
      ...this.getDateFilters(query),
      ...this.getSearchFilter(query?.search),

      {
        $unwind: "$tasks",
      },
      {
        $group: {
          _id: {
            projectId: "$_id",
            status: "$tasks.status",
            originalTaskCount: "$originalTaskCount",
          },
          projectName: { $first: "$name" },
          createdAt: { $first: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      ...this.getOnlyWithAllStatusFilter(query),
      {
        $group: {
          _id: "$_id.projectId",
          projectName: { $first: "$projectName" },
          createdAt: { $first: "$createdAt" },
          taskCounts: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
        },
      },
      ...this.getAggregationOutput(query),
    ];

    return ProjectModel.aggregate(pipes).exec();
  }

  private getAggregationOutput({ groupStatus }: GetProjectsQueryDto) {
    return [
      groupStatus
        ? {
            $project: {
              projectName: 1,
              createdAt: 1,
              taskCounts: 1,
            },
          }
        : {
            $project: {
              projectName: 1,
              createdAt: 1,
            },
          },
    ];
  }

  private getUsersLookup() {
    return {
      $lookup: {
        from: "users",
        localField: "users",
        foreignField: "_id",
        as: "users",
      },
    };
  }

  private getTasksLookup(status?: GetProjectsQueryDto["allStatusesAs"]) {
    return {
      $lookup: {
        from: "tasks",
        localField: "tasks",
        foreignField: "_id",
        as: "tasks",
        pipeline: status
          ? [
              {
                $match: {
                  status: status, // Only include tasks with the queried status
                },
              },
            ]
          : [],
      },
    };
  }

  private getSearchFilter(searchTerm?: string): PipelineStage[] {
    return searchTerm
      ? [
          {
            $match: {
              $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { "tasks.name": { $regex: searchTerm, $options: "i" } },
                { "users.name": { $regex: searchTerm, $options: "i" } },
                { "users.surname": { $regex: searchTerm, $options: "i" } },
              ],
            },
          },
        ]
      : [];
  }

  private getOnlyWithAllStatusFilter({
    allStatusesAs,
  }: GetProjectsQueryDto): PipelineStage[] {
    return allStatusesAs
      ? [
          {
            $match: {
              $expr: { $eq: ["$count", "$_id.originalTaskCount"] },
            },
          },
        ]
      : [];
  }

  private getDateFilters({
    dateFrom,
    dateTo,
  }: GetProjectsQueryDto): PipelineStage[] {
    // Filter out projects with any other tasks than with queried status

    const pipes: PipelineStage[] = [];

    if (dateFrom) {
      pipes.push({
        $match: {
          createdAt: { $gte: dateFrom },
        },
      });
    }

    if (dateTo) {
      pipes.push({
        $match: {
          createdAt: { $lte: dateTo },
        },
      });
    }

    return pipes;
  }

  private getTotalTasksCountHelper() {
    return {
      $addFields: {
        originalTaskCount: { $size: "$tasks" },
      },
    };
  }
}

export const projectService = new ProjectService();
