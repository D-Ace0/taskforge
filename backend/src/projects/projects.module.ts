import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { AuthModule } from '../auth/auth.module';
import { ProjectAccessService } from './project-access.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectAccessService],
  imports: [AuthModule, WorkspacesModule],
  exports: [ProjectAccessService],
})
export class ProjectsModule {}
