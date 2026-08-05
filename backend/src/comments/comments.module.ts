import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { ProjectsModule } from '../projects/projects.module';
import { IssuesModule } from '../issues/issues.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [WorkspacesModule, ProjectsModule, IssuesModule],
})
export class CommentsModule {}
