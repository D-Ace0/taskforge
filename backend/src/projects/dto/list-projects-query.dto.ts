import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum ProjectStatusFilter {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  ALL = 'all',
}

export class ListProjectQueryDto {
  @IsOptional()
  @IsEnum(ProjectStatusFilter)
  status: ProjectStatusFilter = ProjectStatusFilter.ACTIVE;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @IsInt()
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 20;
}
