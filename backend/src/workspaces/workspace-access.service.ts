import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WorkspaceAccessService {
  constructor(private readonly prismaService: PrismaService) {}

  async requireMembership(userId: string, workspaceId: string) {
    const membership = await this.findMembership(userId, workspaceId);

    if (!membership) {
      throw new NotFoundException('Workspace not found');
    }

    return membership;
  }

  async findMembership(userId: string, workspaceId: string) {
    return this.prismaService.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      select: {
        id: true,
        role: true,
      },
    });
  }
}
