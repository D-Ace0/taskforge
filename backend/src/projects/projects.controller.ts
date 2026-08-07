import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ListProjectQueryDto } from './dto/list-projects-query.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@ApiBearerAuth('access-token')
@Controller('workspaces/:workspaceId/projects')
@UseGuards(AccessTokenGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    const creatorId = req.user.sub;
    return this.projectsService.create(
      creatorId,
      workspaceId,
      createProjectDto,
    );
  }

  @Get()
  getProjects(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Query() query: ListProjectQueryDto,
  ) {
    return this.projectsService.getProjects(req.user.sub, workspaceId, query);
  }

  @Get(':projectId')
  getOneProject(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
  ) {
    return this.projectsService.getOneProject(
      req.user.sub,
      workspaceId,
      projectId,
    );
  }

  @Patch(':projectId')
  updateProject(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(
      req.user.sub,
      workspaceId,
      projectId,
      updateProjectDto,
    );
  }

  @Patch(':projectId/archive')
  archiveProject(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
  ) {
    return this.projectsService.archiveProject(
      req.user.sub,
      workspaceId,
      projectId,
    );
  }

  @Patch(':projectId/restore')
  restoreProject(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
  ) {
    return this.projectsService.restoreProject(
      req.user.sub,
      workspaceId,
      projectId,
    );
  }

  @Delete(':projectId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProject(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
  ) {
    return this.projectsService.deleteProject(
      req.user.sub,
      workspaceId,
      projectId,
    );
  }
}
