import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProjectAccessService {
  constructor(private readonly prismaService: PrismaService) {}

  async requireProjectInWorkspace(projectId: string, workspaceId: string) {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
        workspaceId,
      },
      select: {
        id: true,
        workspaceId: true,
        archivedAt: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }
}
