import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class IssueAccessService {
  constructor(private readonly prismaService: PrismaService) {}
  async requireIssueInProject(issueId: string, projectId: string) {
    const issue = await this.prismaService.issue.findFirst({
      where: {
        id: issueId,
        projectId: projectId,
      },
      select: {
        id: true,
        createdById: true,
        projectId: true,
      },
    });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }
    return issue;
  }
}
