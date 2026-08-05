import { IsUUID, ValidateIf } from 'class-validator';

export class UpdateIssueAssigneeDto {
  @ValidateIf((obj, val) => val !== null)
  @IsUUID('4')
  assigneeId!: string | null;
}
