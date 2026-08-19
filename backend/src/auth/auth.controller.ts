import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import type { AuthenticatedRequest } from './types/authenticated-request';
import type { Response } from 'express';
import type { RefreshRequest } from './types/refresh-request';
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({
    default: {
      limit: 5, // rate limiting: 5 requests per minute
      ttl: 60_000,
    },
  })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Throttle({
    default: {
      limit: 5, // rate limiting: 5 requests per minute
      ttl: 60_000,
    },
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, refreshTokenExpiresAt, ...responseBody } =
      await this.authService.login(loginDto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/auth',
      expires: refreshTokenExpiresAt,
    });
    return responseBody;
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  getCurrentUser(@Req() req: AuthenticatedRequest) {
    return this.authService.getCurrentUser(req.user.sub);
  }

  @Throttle({
    default: {
      limit: 30, // rate limiting: 30 requests per minute
      ttl: 60_000,
    },
  })
  @Post('refresh')
  @ApiCookieAuth('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: RefreshRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const currentRefreshToken = req.cookies.refreshToken;
    if (!currentRefreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    const { refreshToken, refreshTokenExpiresAt, ...responseBody } =
      await this.authService.refresh(currentRefreshToken);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/auth',
      expires: refreshTokenExpiresAt,
    });
    return responseBody;
  }

  @Post('logout')
  @ApiCookieAuth('refresh-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() req: RefreshRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/auth',
    });
  }
}
