import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { ProjectsModule } from '../projects/projects.module';
import { IssueAccessService } from './issue-access.service';

@Module({
  controllers: [IssuesController],
  providers: [IssuesService, IssueAccessService],
  imports: [WorkspacesModule, ProjectsModule],
  exports: [IssueAccessService],
})
export class IssuesModule {}
