import { IsIn } from 'class-validator';
import { WorkspaceRole } from '../../generated/prisma/enums';

export class UpdateWorkspaceMemberRoleDto {
  @IsIn([WorkspaceRole.ADMIN, WorkspaceRole.MEMBER])
  role!: WorkspaceRole;
}
