import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AddWorkspaceMemberDto } from './dto/add-workspace-member.dto';
import { WorkspaceRole } from '../generated/prisma/enums';
import { UsersService } from '../users/users.service';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto, userId: string) {
    return this.prismaService.workspace.create({
      data: {
        name: createWorkspaceDto.name.trim(),
        description: createWorkspaceDto.description?.trim() || null,
        createdById: userId,
        memberships: {
          create: {
            userId: userId,
            role: 'OWNER',
          },
        },
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
        memberships: {
          select: {
            id: true,
            userId: true,
            role: true,
            joinedAt: true,
          },
        },
        createdAt: true,
      },
    });
  }

  async getMyWorkspaces(userId: string) {
    return this.prismaService.workspaceMember.findMany({
      where: {
        userId: userId,
      },
      select: {
        role: true,
        joinedAt: true,
        workspace: {
          select: {
            id: true,
            name: true,
            description: true,
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
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });
  }

  async findOneForMember(workspaceId: string, userId: string) {
    const membership = await this.prismaService.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      select: {
        role: true,
        joinedAt: true,
        workspace: {
          select: {
            id: true,
            name: true,
            description: true,
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
        },
      },
    });
    if (!membership) {
      throw new NotFoundException('workspace not found');
    }
    return membership;
  }

  async update(
    workspaceId: string,
    userId: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const membership = await this.prismaService.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      select: {
        role: true,
      },
    });

    if (!membership) {
      throw new NotFoundException('Workspace not found'); //user is not a memeber of this workspace
    }

    if (membership.role !== 'OWNER') {
      throw new ForbiddenException('Only the workspace owner can update it'); // non owner update is forbidden
    }

    if (
      updateWorkspaceDto.name === undefined &&
      updateWorkspaceDto.description === undefined
    ) {
      throw new BadRequestException('At least one field must be provided');
    }

    const normalizedName = updateWorkspaceDto.name?.trim();

    if (updateWorkspaceDto.name !== undefined && normalizedName!.length < 2) {
      throw new BadRequestException(
        'Workspace name must contain at least 2 characters',
      );
    }

    const result = await this.prismaService.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        name: normalizedName,
        description:
          updateWorkspaceDto.description === undefined
            ? undefined
            : updateWorkspaceDto.description.trim() || null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        updatedAt: true,
      },
    });

    return result;
  }

  async addMember(
    requesterId: string,
    workspaceId: string,
    addWorkspaceMemberDto: AddWorkspaceMemberDto,
  ) {
    const requesterMembership =
      await this.prismaService.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: requesterId,
            workspaceId,
          },
        },
        select: {
          role: true,
        },
      });

    if (!requesterMembership) {
      throw new NotFoundException('Workspace not found'); //requester is not a memeber of this workspace
    }

    if (requesterMembership.role === WorkspaceRole.MEMBER) {
      throw new ForbiddenException('Forbidden action');
    }

    if (addWorkspaceMemberDto.role === WorkspaceRole.OWNER) {
      throw new ForbiddenException('Forbidden action');
    }

    if (
      addWorkspaceMemberDto.role === WorkspaceRole.ADMIN &&
      requesterMembership.role === WorkspaceRole.ADMIN
    ) {
      throw new ForbiddenException('Forbidden action');
    }

    const user = await this.usersService.findByEmail(
      addWorkspaceMemberDto.email.trim(),
    );
    if (!user) {
      throw new NotFoundException('User you are trying to add is not found'); //requester is not a memeber of this workspace
    }

    try {
      return await this.prismaService.workspaceMember.create({
        data: {
          workspaceId: workspaceId,
          userId: user.id,
          role: addWorkspaceMemberDto.role,
        },
        select: {
          id: true,
          userId: true,
          workspaceId: true,
          role: true,
          joinedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User is already a workspace member');
      }
      throw error;
    }
  }
}
