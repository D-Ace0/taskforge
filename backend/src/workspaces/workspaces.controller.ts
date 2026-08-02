import {
  Body,
  Controller,
  Delete,
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
import { UpdateWorkspaceMemberRoleDto } from './dto/update-workspace-member-role.dto';

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
  addMember(
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

  @Get(':workspaceId/members')
  @UseGuards(AccessTokenGuard)
  getMembers(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
  ) {
    const userId = req.user.sub;
    return this.workspacesService.getMembers(userId, workspaceId);
  }

  @Patch(':workspaceId/members/:membershipId/role')
  @UseGuards(AccessTokenGuard)
  updateMemberRole(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('membershipId', new ParseUUIDPipe({ version: '4' }))
    membershipId: string,
    @Body() updateWorkspaceMemberRoleDto: UpdateWorkspaceMemberRoleDto,
  ) {
    const requesterId = req.user.sub;
    return this.workspacesService.updateMemberRole(
      requesterId,
      workspaceId,
      membershipId,
      updateWorkspaceMemberRoleDto,
    );
  }

  @Delete(':workspaceId/members/:membershipId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenGuard)
  deleteMember(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('membershipId', new ParseUUIDPipe({ version: '4' }))
    membershipId: string,
  ) {
    const requesterId = req.user.sub;
    return this.workspacesService.deleteMember(requesterId, workspaceId, membershipId)
  }

  @Delete(':workspaceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenGuard)
  deleteWorkspace(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId', new ParseUUIDPipe({version: '4'})) workspaceId: string
  ){
    const requesterId = req.user.sub
    return this.workspacesService.deleteWorkspace(requesterId, workspaceId)
  }
}
