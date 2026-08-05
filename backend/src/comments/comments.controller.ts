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
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller(
  'workspaces/:workspaceId/projects/:projectId/issues/:issueId/comments',
)
@UseGuards(AccessTokenGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Param('issueId', new ParseUUIDPipe({ version: '4' })) issueId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(
      req.user.sub,
      workspaceId,
      projectId,
      issueId,
      createCommentDto,
    );
  }

  @Get()
  listComments(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Param('issueId', new ParseUUIDPipe({ version: '4' })) issueId: string,
  ) {
    return this.commentsService.listComments(
      req.user.sub,
      workspaceId,
      projectId,
      issueId,
    );
  }

  @Patch(':commentId')
  updateComment(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Param('issueId', new ParseUUIDPipe({ version: '4' })) issueId: string,
    @Param('commentId', new ParseUUIDPipe({ version: '4' })) commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(
      req.user.sub,
      workspaceId,
      projectId,
      issueId,
      commentId,
      updateCommentDto,
    );
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteComment(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Param('issueId', new ParseUUIDPipe({ version: '4' })) issueId: string,
    @Param('commentId', new ParseUUIDPipe({ version: '4' })) commentId: string,
  ) {
    return this.commentsService.deleteComment(
      req.user.sub,
      workspaceId,
      projectId,
      issueId,
      commentId,
    );
  }
}
