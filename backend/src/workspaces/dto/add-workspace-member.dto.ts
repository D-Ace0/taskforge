import { IsEmail, IsIn } from 'class-validator';
import { WorkspaceRole } from '../../generated/prisma/enums';

export class AddWorkspaceMemberDto {
  @IsEmail()
  email!: string;

  @IsIn([WorkspaceRole.ADMIN, WorkspaceRole.MEMBER])
  role!: WorkspaceRole;
}
