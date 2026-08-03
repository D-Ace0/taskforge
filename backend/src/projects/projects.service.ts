import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { WorkspaceRole } from '../generated/prisma/enums';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ListProjectQueryDto,
  ProjectStatusFilter,
} from './dto/list-projects-query.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly workspaceService: WorkspacesService,
  ) {}

  async create(creatorId: string, workspaceId: string, dto: CreateProjectDto) {
    const membership = await this.workspaceService.requireMembership(
      creatorId,
      workspaceId,
    );
    if (membership.role === WorkspaceRole.MEMBER) {
      throw new ForbiddenException('Forbidden Action');
    }
    return this.prismaService.project.create({
      data: {
        name: dto.name.trim(),
        description: dto.description?.trim() || null,
        workspaceId: workspaceId,
        createdById: creatorId,
      },
    });
  }

  async getProjects(
    requesterId: string,
    workspaceId: string,
    query: ListProjectQueryDto,
  ) {
    await this.workspaceService.requireMembership(requesterId, workspaceId);
    const archivedAt =
      query.status === ProjectStatusFilter.ACTIVE
        ? null
        : query.status === ProjectStatusFilter.ARCHIVED
          ? { not: null }
          : undefined;

    const projects = await this.prismaService.project.findMany({
      where: {
        workspaceId: workspaceId,
        archivedAt: archivedAt,
      },
      select: {
        id: true,
        name: true,
        description: true,
        archivedAt: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
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
    return { projects };
  }

  async getOneProject(
    requesterId: string,
    workspaceId: string,
    projectId: string,
  ) {
    await this.workspaceService.requireMembership(requesterId, workspaceId);
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
        workspaceId: workspaceId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdAt: true,
        archivedAt: true,
        updatedAt: true,
        workspace: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
      },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async updateProject(
    requesterId: string,
    workspaceId: string,
    projectId: string,
    dto: UpdateProjectDto,
  ) {
    const membership = await this.workspaceService.requireMembership(
      requesterId,
      workspaceId,
    );
    if (membership.role === WorkspaceRole.MEMBER) {
      throw new ForbiddenException('Forbidden action');
    }

    if (dto.name === undefined && dto.description === undefined) {
      throw new BadRequestException('At least one field must be provided');
    }

    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
        workspaceId: workspaceId,
        archivedAt: null,
      },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prismaService.project.update({
      where: {
        id: projectId,
        workspaceId: workspaceId,
        archivedAt: null, // only active projects are allowed to be updated.
      },
      data: {
        name: dto.name === undefined ? undefined : dto.name.trim(),
        description:
          dto.description === undefined
            ? undefined
            : dto.description?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        archivedAt: true,
        updatedAt: true,
        createdById: true,
      },
    });
  }

  async archiveProject(
    requesterId: string,
    workspaceId: string,
    projectId: string,
  ) {
    const membership = await this.workspaceService.requireMembership(
      requesterId,
      workspaceId,
    );
    if (membership.role === WorkspaceRole.MEMBER) {
      throw new ForbiddenException('Forbidden action');
    }
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
        workspaceId: workspaceId,
      },
      select: {
        archivedAt: true,
      },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    } else if (project.archivedAt !== null) {
      throw new ConflictException('Project is already archived');
    }

    return this.prismaService.project.update({
      where: {
        id: projectId,
        workspaceId: workspaceId,
        archivedAt: null,
      },
      data: {
        archivedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        archivedAt: true,
        updatedAt: true,
      },
    });
  }

  async restoreProject(
    requesterId: string,
    workspaceId: string,
    projectId: string,
  ) {
    const membership = await this.workspaceService.requireMembership(
      requesterId,
      workspaceId,
    );
    if (membership.role === WorkspaceRole.MEMBER) {
      throw new ForbiddenException('Forbidden action');
    }
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
        workspaceId: workspaceId,
      },
      select: {
        archivedAt: true,
      },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (project.archivedAt === null) {
      throw new ConflictException('Project is already active');
    }
    return this.prismaService.project.update({
      where: {
        id: projectId,
        workspaceId: workspaceId,
      },
      data: {
        archivedAt: null,
      },
      select: {
        id: true,
        name: true,
        archivedAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteProject(
    requesterId: string,
    workspaceId: string,
    projectId: string,
  ): Promise<void> {
    const membership = await this.workspaceService.requireMembership(
      requesterId,
      workspaceId,
    );
    if (membership.role === WorkspaceRole.MEMBER) {
      throw new ForbiddenException('Forbidden action');
    }
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
        workspaceId: workspaceId,
      },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    await this.prismaService.project.delete({
      where: {
        id: projectId,
        workspaceId: workspaceId,
      },
    });
  }
}
