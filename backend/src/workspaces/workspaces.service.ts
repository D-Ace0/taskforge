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
import { UpdateWorkspaceMemberRoleDto } from './dto/update-workspace-member-role.dto';
import { WorkspaceAccessService } from './workspace-access.service';

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly workspaceAccessService: WorkspaceAccessService,
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
    const membership = await this.workspaceAccessService.requireMembership(
      userId,
      workspaceId,
    );

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
      await this.workspaceAccessService.requireMembership(
        requesterId,
        workspaceId,
      );

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

  async getMembers(userId: string, workspaceId: string) {
    await this.workspaceAccessService.requireMembership(userId, workspaceId);

    return this.prismaService.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      select: {
        memberships: {
          orderBy: {
            joinedAt: 'asc',
          },
          select: {
            id: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
            joinedAt: true,
            role: true,
          },
        },
      },
    });
  }

  async updateMemberRole(
    requesterId: string,
    workspaceId: string,
    membershipId: string,
    dto: UpdateWorkspaceMemberRoleDto,
  ) {
    const requresterMembership =
      await this.workspaceAccessService.requireMembership(
        requesterId,
        workspaceId,
      );
    if (
      requresterMembership.role === WorkspaceRole.ADMIN ||
      requresterMembership.role === WorkspaceRole.MEMBER
    ) {
      throw new ForbiddenException('Forbidden action');
    }
    const targetMembership = await this.prismaService.workspaceMember.findFirst(
      {
        where: {
          workspaceId,
          id: membershipId,
        },
        select: {
          role: true,
        },
      },
    );
    if (!targetMembership) {
      throw new NotFoundException('membership not found'); // owners can not update roles of cross-tenant users
    }

    if (targetMembership.role === WorkspaceRole.OWNER) {
      throw new ForbiddenException(
        'The workspace owner role cannot be changed', // at least 1 owner should exist in a workspace
      );
    }

    return this.prismaService.workspaceMember.update({
      where: {
        id: membershipId,
        workspaceId: workspaceId,
      },
      data: {
        role: dto.role,
      },
      select: {
        id: true,
        workspaceId: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        joinedAt: true,
        role: true,
      },
    });
  }

  async deleteMember(
    requesterId: string,
    workspaceId: string,
    membershipId: string,
  ): Promise<void> {
    const requester = await this.workspaceAccessService.requireMembership(
      requesterId,
      workspaceId,
    );
    if (requester.role === WorkspaceRole.MEMBER) {
      throw new ForbiddenException(
        'Forbidden action, contact your administrator if you need to perform this action',
      );
    }
    const targetMembership = await this.prismaService.workspaceMember.findFirst(
      {
        where: {
          workspaceId,
          id: membershipId,
        },
        select: {
          role: true,
        },
      },
    );
    if (!targetMembership) {
      throw new NotFoundException('membership not found'); // owners can not update roles of cross-tenant users
    }

    if (targetMembership.role === WorkspaceRole.OWNER) {
      throw new ForbiddenException(
        'The workspace owner role cannot be removed', // at least 1 owner should exist in a workspace
      );
    }

    if (
      requester.role === WorkspaceRole.ADMIN &&
      targetMembership.role === WorkspaceRole.ADMIN
    ) {
      throw new ForbiddenException('Admins can not modify other Admins');
    }
    await this.prismaService.workspaceMember.delete({
      where: {
        workspaceId: workspaceId,
        id: membershipId,
      },
    });
  }

  async deleteWorkspace(
    requesterId: string,
    workspaceId: string,
  ): Promise<void> {
    // +++++++++++++++++ NOTE +++++++++++++++++
    //  Deleting a workspace deletes the corresponding WorkspaceMember rows, so the memberships will also be deleted.
    // Look at the schema.prisma to know more

    const membership = await this.workspaceAccessService.requireMembership(
      requesterId,
      workspaceId,
    );
    if (membership.role !== WorkspaceRole.OWNER) {
      throw new ForbiddenException('Forbidden Action'); // non owners can not delete workspaces
    }
    await this.prismaService.workspace.delete({
      where: {
        id: workspaceId,
      },
    });
  }
}
