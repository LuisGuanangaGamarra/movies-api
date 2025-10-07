import { Test, TestingModule } from '@nestjs/testing';

import { RegisterUserUseCase } from 'src/users/aplication/use-cases/register-user.usecase';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from 'src/users/domain/repositories/user.repository';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from 'src/users/domain/repositories/role.repository';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { RegisterUserInputDTO } from 'src/users/aplication/dtos/register-user-input.dto';
import { registerUserInputMock } from '../../../shared/mocks/user-input.mock';

const mockHash: jest.Mock<Promise<string>, [string, number]> = jest.fn<
  Promise<string>,
  [string, number]
>();

jest.mock('bcrypt', () => ({
  hash: (plainPassword: string, salt: number) => mockHash(plainPassword, salt),
}));

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepositoryMock: jest.Mocked<IUserRepository>;
  let roleRepositoryMock: jest.Mocked<IRoleRepository>;
  const input = registerUserInputMock as RegisterUserInputDTO;

  beforeEach(async () => {
    userRepositoryMock = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    } as Partial<IUserRepository> as jest.Mocked<IUserRepository>;

    roleRepositoryMock = {
      findByName: jest.fn(),
    } as Partial<IRoleRepository> as jest.Mocked<IRoleRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        { provide: USER_REPOSITORY, useValue: userRepositoryMock },
        { provide: ROLE_REPOSITORY, useValue: roleRepositoryMock },
      ],
    }).compile();

    useCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería lanzar DomainException si el usuario ya existe', async () => {
    userRepositoryMock.findByEmail.mockResolvedValueOnce({
      id: 1,
      email: input.email,
      passwordHash: 'hashedPassword',
      role: {
        name: 'ADMIN',
        id: 1,
        permission: [],
      },
    });

    await expect(useCase.execute(input)).rejects.toThrow(
      new DomainException('USER_ALREADY_EXISTS', 'email ya registrado', {
        email: input.email,
      }),
    );
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(input.email);
    expect(roleRepositoryMock.findByName).not.toHaveBeenCalled();
    expect(userRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('debería lanzar DomainException si el rol especificado no existe', async () => {
    userRepositoryMock.findByEmail.mockResolvedValueOnce(null);
    roleRepositoryMock.findByName.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(
      new DomainException('ROLE_NOT_FOUND', 'rol no encontrado'),
    );
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(input.email);
    expect(roleRepositoryMock.findByName).toHaveBeenCalledWith(input.role);
    expect(userRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('debería guardar el usuario correctamente si no existe y el rol es válido', async () => {
    const hashedPassword = 'hashedPassword123';
    mockHash.mockResolvedValueOnce(hashedPassword);
    userRepositoryMock.findByEmail.mockResolvedValueOnce(null);
    roleRepositoryMock.findByName.mockResolvedValueOnce({
      id: 1,
      name: 'ADMIN',
      permission: [],
    });

    await useCase.execute(input);

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(input.email);
    expect(roleRepositoryMock.findByName).toHaveBeenCalledWith(input.role);
    expect(mockHash).toHaveBeenCalledWith(input.password, 12);
    expect(userRepositoryMock.save).toHaveBeenCalledWith({
      email: input.email,
      passwordHash: hashedPassword,
      role: {
        id: 1,
        name: 'ADMIN',
        permission: [],
      },
    });
  });
});
