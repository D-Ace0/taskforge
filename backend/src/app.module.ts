import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ProjectsModule } from './projects/projects.module';
import { IssuesModule } from './issues/issues.module';
import { CommentsModule } from './comments/comments.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),

        PORT: Joi.number().port().default(3000),

        DATABASE_URL: Joi.string().required(),

        JWT_ACCESS_SECRET: Joi.string().min(32).required(),

        FRONTEND_URL: Joi.string()
          .uri({
            scheme: ['http', 'https'],
          })
          .required(),
      }),
    }),
    UsersModule,
    AuthModule,
    DatabaseModule,
    WorkspacesModule,
    ProjectsModule,
    IssuesModule,
    CommentsModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000, // ms -> 60s = 1 minute
          limit: 100, // 100 requests per minute.
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD, //APP_GUARD means Nest executes that guard for every endpoint.
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
