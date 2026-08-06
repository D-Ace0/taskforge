import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { IssuePriority, IssueStatus } from '../../generated/prisma/enums';
import { Type } from 'class-transformer';

export class ListIssueQueryDto {
  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @IsOptional()
  @IsEnum(IssuePriority)
  priority?: IssuePriority;

  @IsOptional()
  @IsUUID('4')
  assigneeId?: string;

  @IsOptional()
  @IsUUID('4')
  createdById?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 20;
}
