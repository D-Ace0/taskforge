import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  const usersServiceMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('normalizes registration data, hashes the password, and creates a user', async () => {
    const password = 'a secure testing passphrase';

    const createdUser = {
      id: 'user-id',
      name: 'Ahmed',
      email: 'ahmed@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    usersServiceMock.create.mockResolvedValue(createdUser);

    const result = await authService.register({
      name: '  Ahmed  ',
      email: '  AHMED@EXAMPLE.COM  ',
      password,
    });

    expect(usersServiceMock.create).toHaveBeenCalledTimes(1);

    const createInput = usersServiceMock.create.mock.calls[0][0];

    expect(createInput.name).toBe('Ahmed');
    expect(createInput.email).toBe('ahmed@example.com');
    expect(createInput.passwordHash).not.toBe(password);
    expect(await argon2.verify(createInput.passwordHash, password)).toBe(true);

    expect(result).toBe(createdUser);
  });
});
