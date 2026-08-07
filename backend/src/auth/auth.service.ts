import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { SessionsService } from './sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19_456,
      timeCost: 2,
      parallelism: 1,
    });

    return this.usersService.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
    });
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const { passwordHash, ...userWithoutPassword } = user;
    const [accessToken, session] = await Promise.all([
      this.jwtService.signAsync({ sub: user.id }),
      this.sessionsService.create(user.id),
    ]);

    return {
      accessToken,
      refreshToken: session.refreshToken,
      refreshTokenExpiresAt: session.expiresAt,
      user: userWithoutPassword,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async refresh(refreshToken: string) {
    const session = await this.sessionsService.findByRefreshToken(refreshToken);
    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (session.revokedAt !== null) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: session.userId,
    });
    const rotatedSession = await this.sessionsService.rotate(
      session.id,
      refreshToken,
    );

    if (!rotatedSession) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      accessToken,
      refreshToken: rotatedSession.refreshToken,
      refreshTokenExpiresAt: rotatedSession.expiresAt,
    };
  }

  async logout(refreshToken: string) {
    await this.sessionsService.revoke(refreshToken);
  }
}
