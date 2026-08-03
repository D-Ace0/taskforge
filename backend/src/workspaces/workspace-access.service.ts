import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WorkspaceAccessService {
  constructor(private readonly prismaService: PrismaService) {}

  async requireMembership(userId: string, workspaceId: string) {
    const membership = await this.prismaService.workspaceMember.findUnique({
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

    if (!membership) {
      throw new NotFoundException('Workspace not found');
    }

    return membership;
  }
}
