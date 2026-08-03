import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { WorkspaceAccessService } from './workspace-access.service';

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspacesService, WorkspaceAccessService],
  imports: [AuthModule, UsersModule],
  exports: [WorkspaceAccessService],
})
export class WorkspacesModule {}
