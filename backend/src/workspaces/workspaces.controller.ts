import {
  Body,
  Controller,
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
import { WorkspacesService } from './workspaces.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AddWorkspaceMemberDto } from './dto/add-workspace-member.dto';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post('')
  @UseGuards(AccessTokenGuard)
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub;
    return this.workspacesService.create(createWorkspaceDto, userId);
  }

  @Get('')
  @UseGuards(AccessTokenGuard)
  async getMyWorkspaces(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.workspacesService.getMyWorkspaces(userId);
  }

  @Get(':workspaceId')
  @UseGuards(AccessTokenGuard)
  async findOneForMember(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
  ) {
    const userId = req.user.sub;
    return this.workspacesService.findOneForMember(workspaceId, userId);
  }

  @Patch(':workspaceId')
  @UseGuards(AccessTokenGuard)
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const userId = req.user.sub;
    return this.workspacesService.update(
      workspaceId,
      userId,
      updateWorkspaceDto,
    );
  }

  @Post(':workspaceId/members')
  @UseGuards(AccessTokenGuard)
  async addMember(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Body() addWorkspaceMemberDto: AddWorkspaceMemberDto,
  ) {
    const requesterId = req.user.sub;
    return this.workspacesService.addMember(
      requesterId,
      workspaceId,
      addWorkspaceMemberDto,
    );
  }
}
