import { IsEnum, IsOptional } from 'class-validator';

export enum ProjectStatusFilter {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  ALL = 'all',
}

export class ListProjectQueryDto {
  @IsOptional()
  @IsEnum(ProjectStatusFilter)
  status: ProjectStatusFilter = ProjectStatusFilter.ACTIVE;
}
