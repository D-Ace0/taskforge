import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { IssuePriority, IssueStatus } from '../../generated/prisma/enums';

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
}
