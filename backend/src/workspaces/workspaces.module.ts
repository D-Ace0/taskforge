import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
  imports: [AuthModule, UsersModule],
})
export class WorkspacesModule {}
