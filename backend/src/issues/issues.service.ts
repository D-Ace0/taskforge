import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WorkspaceAccessService } from '../workspaces/workspace-access.service';
import { PrismaService } from '../database/prisma.service';
import { ProjectAccessService } from '../projects/project-access.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { ListIssueQueryDto } from './dto/list-issues-query.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { WorkspaceRole } from '../generated/prisma/enums';
import { UpdateIssueAssigneeDto } from './dto/update-issue-assignee.dto';

@Injectable()
export class IssuesService {
  constructor(
    private readonly workspaceAccessService: WorkspaceAccessService,
    private readonly projectAccessService: ProjectAccessService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(
    creatorId: string,
    workspaceId: string,
    projectId: string,
    dto: CreateIssueDto,
  ) {
    await this.workspaceAccessService.requireMembership(creatorId, workspaceId);
    const project = await this.projectAccessService.requireProjectInWorkspace(
      projectId,
      workspaceId,
    );
    if (project.archivedAt !== null) {
      throw new ConflictException(
        'Cannot create issues in an archived project',
      );
    }

    const normalizedTitle = dto.title.trim();
    const assigneeMembership = dto.assigneeId
      ? await this.workspaceAccessService.findMembership(
          dto.assigneeId,
          workspaceId,
        )
      : null;

    if (dto.assigneeId && !assigneeMembership) {
      throw new BadRequestException('Assignee must be a workspace member');
    }

    return this.prismaService.issue.create({
      data: {
        title: normalizedTitle,
        projectId: projectId,
        createdById: creatorId,
        priority: dto.priority,
        description: dto.description?.trim() || null,
        assigneeId: dto.assigneeId ?? null,
      },
    });
  }

  async getIssues(
    requesterId: string,
    workspaceId: string,
    projectId: string,
    dto: ListIssueQueryDto,
  ) {
    await this.workspaceAccessService.requireMembership(
      requesterId,
      workspaceId,
    );
    await this.projectAccessService.requireProjectInWorkspace(
      projectId,
      workspaceId,
    );
    const issues = await this.prismaService.issue.findMany({
      where: {
        projectId: projectId,
        status: dto.status,
        priority: dto.priority,
        assigneeId: dto.assigneeId,
        createdById: dto.createdById,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { issues };
  }

  async getIssue(
    requesterId: string,
    workspaceId: string,
    projectId: string,
    issueId: string,
  ) {
    await this.workspaceAccessService.requireMembership(
      requesterId,
      workspaceId,
    );
    await this.projectAccessService.requireProjectInWorkspace(
      projectId,
      workspaceId,
    );
    const issue = await this.prismaService.issue.findFirst({
      where: {
        id: issueId,
        projectId: projectId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            archivedAt: true,
          },
        },
      },
    });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }
    return issue;
  }

  async updateIssue(
    requesterId: string,
    workspaceId: string,
    projectId: string,
    issueId: string,
    dto: UpdateIssueDto,
  ) {
    const requester = await this.workspaceAccessService.requireMembership(
      requesterId,
      workspaceId,
    );
    const project = await this.projectAccessService.requireProjectInWorkspace(
      projectId,
      workspaceId,
    );
    if (project.archivedAt !== null) {
      throw new ConflictException(
        'Cannot update issues in an archived project',
      );
    }
    const issue = await this.prismaService.issue.findFirst({
      where: {
        id: issueId,
        projectId: projectId,
      },
      select: {
        createdById: true,
      },
    });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }
    if (
      requesterId !== issue.createdById &&
      requester.role === WorkspaceRole.MEMBER
    ) {
      throw new ForbiddenException(
        'Members are not allowed to update issues created by others',
      );
    }
    if (
      dto.title === undefined &&
      dto.description === undefined &&
      dto.status === undefined &&
      dto.priority === undefined
    ) {
      throw new BadRequestException('Cannot update with empty body');
    }
    return this.prismaService.issue.update({
      where: {
        id: issueId,
        projectId: projectId,
      },
      data: {
        title: dto.title === undefined ? undefined : dto.title.trim(),
        description:
          dto.description === undefined
            ? undefined
            : dto.description.trim() || null,
        status: dto.status,
        priority: dto.priority,
      },
    });
  }

  async updateIssueAssignee(
    requesterId: string,
    workspaceId: string,
    projectId: string,
    issueId: string,
    dto: UpdateIssueAssigneeDto,
  ) {
    const requesterMembership =
      await this.workspaceAccessService.requireMembership(
        requesterId,
        workspaceId,
      );

    if (requesterMembership.role === WorkspaceRole.MEMBER) {
      throw new ForbiddenException('Members cannot assign or unassign issues');
    }
    const project = await this.projectAccessService.requireProjectInWorkspace(
      projectId,
      workspaceId,
    );
    if (project.archivedAt !== null) {
      throw new ConflictException(
        'Cannot assign or unassign users to issues in an archived project',
      );
    }
    const issue = await this.prismaService.issue.findFirst({
      where: {
        id: issueId,
        projectId: projectId,
      },
    });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }
    if (dto.assigneeId !== null) {
      const assigneeMembership =
        await this.workspaceAccessService.findMembership(
          dto.assigneeId,
          workspaceId,
        );
      if (!assigneeMembership) {
        throw new BadRequestException('Assignee must be a workspace member');
      }
    }
    return this.prismaService.issue.update({
      where: {
        id: issueId,
        projectId: projectId,
      },
      data: {
        assigneeId: dto.assigneeId,
      },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteIssue(
    requesterId: string,
    workspaceId: string,
    projectId: string,
    issueId: string,
  ): Promise<void> {
    const requesterMembership =
      await this.workspaceAccessService.requireMembership(
        requesterId,
        workspaceId,
      );

    if (requesterMembership.role === WorkspaceRole.MEMBER) {
      throw new ForbiddenException('Members cannot delete issues');
    }
    const project = await this.projectAccessService.requireProjectInWorkspace(
      projectId,
      workspaceId,
    );
    if (project.archivedAt !== null) {
      throw new ConflictException(
        'Cannot modify archived projects',
      );
    }
    const issue = await this.prismaService.issue.findFirst({
      where: {
        id: issueId,
        projectId: projectId,
      },
    });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }
    await this.prismaService.issue.delete({
      where: {
        id: issueId,
        projectId: projectId
      }
    })
  }
}
