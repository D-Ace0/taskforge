import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { WorkspaceAccessService } from '../workspaces/workspace-access.service';
import { ProjectAccessService } from '../projects/project-access.service';
import { IssueAccessService } from '../issues/issue-access.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { WorkspaceRole } from '../generated/prisma/enums';
import { ListCommentQueryDto } from './dto/list-comment-query.dto';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly workspaceAccessService: WorkspaceAccessService,
    private readonly projectAccessService: ProjectAccessService,
    private readonly issueAccessService: IssueAccessService,
  ) {}

  async create(
    userId: string,
    workspaceId: string,
    projectId: string,
    issueId: string,
    dto: CreateCommentDto,
  ) {
    await this.workspaceAccessService.requireMembership(userId, workspaceId);
    const project = await this.projectAccessService.requireProjectInWorkspace(
      projectId,
      workspaceId,
    );
    if (project.archivedAt !== null) {
      throw new ConflictException(
        'Cannot comment on issues in an archived project',
      );
    }
    await this.issueAccessService.requireIssueInProject(issueId, projectId);
    const content = dto.content.trim();
    if (!content) {
      throw new BadRequestException('Comment content cannot be empty');
    }
    return this.prismaService.comment.create({
      data: {
        content: content,
        authorId: userId,
        issueId: issueId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async listComments(
    userId: string,
    workspaceId: string,
    projectId: string,
    issueId: string,
    query: ListCommentQueryDto,
  ) {
    await this.workspaceAccessService.requireMembership(userId, workspaceId);
    await this.projectAccessService.requireProjectInWorkspace(
      projectId,
      workspaceId,
    );
    await this.issueAccessService.requireIssueInProject(issueId, projectId);
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const where: Prisma.CommentWhereInput = {
      issueId: issueId,
    };
    const [comments, totalComments] = await Promise.all([
      this.prismaService.comment.findMany({
        where: where,
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        skip: skip,
        take: limit,
      }),
      this.prismaService.comment.count({ where }),
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        totalComments,
        totalPages: Math.ceil(totalComments / limit),
      },
    };
  }

  async updateComment(
    userId: string,
    workspaceId: string,
    projectId: string,
    issueId: string,
    commentId: string,
    dto: UpdateCommentDto,
  ) {
    await this.workspaceAccessService.requireMembership(userId, workspaceId);
    const project = await this.projectAccessService.requireProjectInWorkspace(
      projectId,
      workspaceId,
    );
    if (project.archivedAt !== null) {
      throw new ConflictException(
        'Cannot update comments in an archived project',
      );
    }
    await this.issueAccessService.requireIssueInProject(issueId, projectId);
    const comment = await this.prismaService.comment.findFirst({
      where: {
        id: commentId,
        issueId: issueId,
      },
      select: {
        authorId: true,
      },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (userId !== comment.authorId) {
      throw new ForbiddenException('You can only edit your own comments');
    }
    const content = dto.content.trim();
    if (!content) {
      throw new BadRequestException('Comment content cannot be empty');
    }
    return this.prismaService.comment.update({
      where: {
        id: commentId,
        issueId: issueId,
      },
      data: {
        content: content,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteComment(
    userId: string,
    workspaceId: string,
    projectId: string,
    issueId: string,
    commentId: string,
  ): Promise<void> {
    const membership = await this.workspaceAccessService.requireMembership(
      userId,
      workspaceId,
    );
    const project = await this.projectAccessService.requireProjectInWorkspace(
      projectId,
      workspaceId,
    );
    if (project.archivedAt !== null) {
      throw new ConflictException(
        'Cannot delete comments in an archived project',
      );
    }
    await this.issueAccessService.requireIssueInProject(issueId, projectId);
    const comment = await this.prismaService.comment.findFirst({
      where: {
        id: commentId,
        issueId: issueId,
      },
      select: {
        authorId: true,
      },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (
      membership.role === WorkspaceRole.MEMBER &&
      comment.authorId !== userId
    ) {
      throw new ForbiddenException('You cannot delete this comment');
    }
    await this.prismaService.comment.delete({
      where: {
        id: commentId,
        issueId: issueId,
      },
    });
  }
}
