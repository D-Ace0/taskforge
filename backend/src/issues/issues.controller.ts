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
import { IssuesService } from './issues.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request';
import { CreateIssueDto } from './dto/create-issue.dto';
import { ListIssueQueryDto } from './dto/list-issues-query.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { UpdateIssueAssigneeDto } from './dto/update-issue-assignee.dto';

@Controller('workspaces/:workspaceId/projects/:projectId/issues')
@UseGuards(AccessTokenGuard)
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Body() createIssueDto: CreateIssueDto,
  ) {
    return this.issuesService.create(
      req.user.sub,
      workspaceId,
      projectId,
      createIssueDto,
    );
  }

  @Get()
  getIssues(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Query() query: ListIssueQueryDto,
  ) {
    return this.issuesService.getIssues(
      req.user.sub,
      workspaceId,
      projectId,
      query,
    );
  }

  @Get(':issueId')
  getIssue(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Param('issueId', new ParseUUIDPipe({ version: '4' })) issueId: string,
  ) {
    return this.issuesService.getIssue(
      req.user.sub,
      workspaceId,
      projectId,
      issueId,
    );
  }

  @Patch(':issueId')
  updateIssue(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Param('issueId', new ParseUUIDPipe({ version: '4' })) issueId: string,
    @Body() updateIssueDto: UpdateIssueDto,
  ) {
    return this.issuesService.updateIssue(
      req.user.sub,
      workspaceId,
      projectId,
      issueId,
      updateIssueDto,
    );
  }

  @Patch(':issueId/assignee')
  updateIssueAssignee(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Param('issueId', new ParseUUIDPipe({ version: '4' })) issueId: string,
    @Body() updateIssueAssigneeDto: UpdateIssueAssigneeDto,
  ) {
    return this.issuesService.updateIssueAssignee(
      req.user.sub,
      workspaceId,
      projectId,
      issueId,
      updateIssueAssigneeDto,
    );
  }

  @Delete(':issueId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteIssue(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('projectId', new ParseUUIDPipe({ version: '4' }))
    projectId: string,
    @Param('issueId', new ParseUUIDPipe({ version: '4' }))
    issueId: string,
  ) {
    return this.issuesService.deleteIssue(
      req.user.sub,
      workspaceId,
      projectId,
      issueId,
    );
  }
}
