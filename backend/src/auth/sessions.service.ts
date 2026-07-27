import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RefreshTokenService } from './refresh-token.service';

const REFRESH_TOKEN_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

@Injectable()
export class SessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async create(userId: string) {
    const refreshToken = this.refreshTokenService.generate();
    const refreshTokenHash = this.refreshTokenService.hash(refreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_LIFETIME_MS);

    const session = await this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash,
        expiresAt,
      },
    });

    return {
      sessionId: session.id,
      refreshToken,
      expiresAt,
    };
  }

  findByRefreshToken(refreshToken: string) {
    const refreshTokenHash = this.refreshTokenService.hash(refreshToken);
    return this.prisma.session.findUnique({
      where: {
        refreshTokenHash,
      },
    });
  }

  async rotate(sessionId: string, currentRefreshToken: string) {
    const currentRefreshTokenHash =
      this.refreshTokenService.hash(currentRefreshToken);

    const newRefreshToken = this.refreshTokenService.generate();
    const newRefreshTokenHash = this.refreshTokenService.hash(newRefreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_LIFETIME_MS);

    const result = await this.prisma.session.updateMany({
      where: {
        id: sessionId,
        refreshTokenHash: currentRefreshTokenHash,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        refreshTokenHash: newRefreshTokenHash,
        expiresAt: expiresAt,
      },
    });
    if (result.count !== 1) {
      return null;
    }

    return {
      refreshToken: newRefreshToken,
      expiresAt,
    };
  }

  async revoke(refreshToken: string) {
    const hashedRefreshToken = this.refreshTokenService.hash(refreshToken);

    const result = await this.prisma.session.updateMany({
      where: {
        refreshTokenHash: hashedRefreshToken,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
    return result.count === 1;
  }
}
