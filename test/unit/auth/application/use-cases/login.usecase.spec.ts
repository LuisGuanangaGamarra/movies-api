import { JwtService } from '@nestjs/jwt';

import { LoginInputApplicationDTO } from 'src/auth/application/dtos/login-input-application.dto';
import { LoginUseCase } from 'src/auth/application/use-cases/login.usecase';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from 'src/users/domain/repositories/user.repository';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { userEntityDomainMock } from '../../../shared/mocks/user-entity-domain';
import { Test } from '@nestjs/testing';

import { LoginOutputApplicationDTO } from 'src/auth/application/dtos/login-ouput-application.dto';

const mockCompare: jest.Mock<Promise<boolean>, [string, string]> = jest.fn<
  Promise<boolean>,
  [string, string]
>();

jest.mock('bcrypt', () => ({
  compare: (plainPassword: string, hashedPassword: string) =>
    mockCompare(plainPassword, hashedPassword),
}));

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    userRepository = {
      findByEmail: jest.fn(),
    } as Partial<IUserRepository> as jest.Mocked<IUserRepository>;

    jwtService = {
      signAsync: jest.fn(),
    } as Partial<JwtService> as jest.Mocked<JwtService>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    loginUseCase = moduleRef.get<LoginUseCase>(LoginUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully when email and password are correct', async () => {
    const input: LoginInputApplicationDTO = {
      email: 'test@mail.com',
      password: 'password123',
    };
    const user = userEntityDomainMock;
    user.passwordHash = 'hashed_password';
    user.email = input.email;

    userRepository.findByEmail.mockResolvedValue(user);
    jwtService.signAsync.mockResolvedValue('jwt_token');

    const expectedResult: LoginOutputApplicationDTO = {
      token: 'jwt_token',
    };

    mockCompare.mockResolvedValue(true);

    const result = await loginUseCase.execute(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockCompare).toHaveBeenCalledWith(input.password, user.passwordHash);
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
      role: user.role.name,
    });
    expect(result).toEqual(expectedResult);
  });

  it('should throw DomainException if user is not found', async () => {
    const input: LoginInputApplicationDTO = {
      email: 'nonexistent@mail.com',
      password: 'password123',
    };

    userRepository.findByEmail.mockResolvedValue(null);

    await expect(loginUseCase.execute(input)).rejects.toThrow(
      new DomainException('USER_NOT_FOUND', 'Usuario no encontrado', {
        email: input.email,
      }),
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockCompare).not.toHaveBeenCalled();
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('should throw DomainException if password is incorrect', async () => {
    const input: LoginInputApplicationDTO = {
      email: 'test@mail.com',
      password: 'wrong_password',
    };

    const user = userEntityDomainMock;
    userRepository.findByEmail.mockResolvedValue(user);
    mockCompare.mockResolvedValue(false);

    await expect(loginUseCase.execute(input)).rejects.toThrow(
      new DomainException('INVALID_CREDENTIALS', 'email o password invalido', {
        email: input.email,
        password: input.password,
      }),
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockCompare).toHaveBeenCalledWith(input.password, user.passwordHash);
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});
