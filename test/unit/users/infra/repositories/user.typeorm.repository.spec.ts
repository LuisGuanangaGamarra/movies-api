import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UserTypeOrmRepository } from 'src/users/infra/repositories/user.typeorm.repository';
import { UserOrmEntity } from 'src/users/infra/orm/user.orm-entity';
import { RoleOrmEntity } from 'src/users/infra/orm/role.orm-entity';
import { IUserMapper } from 'src/users/domain/interfaces/user.mapper';
import { USER_MAPPER } from 'src/users/domain/interfaces/user.mapper';
import { mockUserOrmEntity } from '../../../shared/mocks/user-orm.entity.mock';
import { mockDomainEntity } from '../../../shared/mocks/user.entity.mock';

describe('UserTypeOrmRepository', () => {
  let repository: UserTypeOrmRepository;
  let mockUserRepo: jest.Mocked<Repository<UserOrmEntity>>;
  let mockRoleRepo: jest.Mocked<Repository<RoleOrmEntity>>;
  let mockUserMapper: jest.Mocked<IUserMapper>;
  const mockGetOneFn = jest.fn<Promise<UserOrmEntity | null>, []>();

  beforeEach(async () => {
    mockUserRepo = {
      createQueryBuilder: jest.fn().mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: () => mockGetOneFn(),
      })),
      create: jest.fn(),
      save: jest.fn(),
    } as Partial<Repository<UserOrmEntity>> as jest.Mocked<
      Repository<UserOrmEntity>
    >;

    mockRoleRepo = {
      findOne: jest.fn(),
    } as Partial<Repository<RoleOrmEntity>> as jest.Mocked<
      Repository<RoleOrmEntity>
    >;

    mockUserMapper = {
      fromOrmEntityToDomain: jest.fn(),
    } as Partial<IUserMapper> as jest.Mocked<IUserMapper>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTypeOrmRepository,
        { provide: getRepositoryToken(UserOrmEntity), useValue: mockUserRepo },
        { provide: getRepositoryToken(RoleOrmEntity), useValue: mockRoleRepo },
        { provide: USER_MAPPER, useValue: mockUserMapper },
      ],
    }).compile();

    repository = module.get<UserTypeOrmRepository>(UserTypeOrmRepository);
  });

  describe('findByEmail', () => {
    it('debería retornar null si no se encuentra un usuario con el email dado', async () => {
      const email = 'test@test.com';
      mockGetOneFn.mockResolvedValue(null);
      const result = await repository.findByEmail(email);

      expect(mockUserRepo.createQueryBuilder).toHaveBeenCalledWith('user');

      expect(mockGetOneFn).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('debería retornar un UserEntity si se encuentra un usuario con el email dado', async () => {
      mockGetOneFn.mockResolvedValue(mockUserOrmEntity);

      mockUserMapper.fromOrmEntityToDomain.mockReturnValue(mockDomainEntity);

      const result = await repository.findByEmail(mockDomainEntity.email);

      expect(mockGetOneFn).toHaveBeenCalled();
      expect(mockUserMapper.fromOrmEntityToDomain).toHaveBeenCalledWith(
        mockUserOrmEntity,
      );
      expect(result).toEqual(mockDomainEntity);
    });
  });

  describe('findById', () => {
    it('debería retornar null si no se encuentra un usuario por id', async () => {
      mockGetOneFn.mockResolvedValue(null);
      const result = await repository.findById(1);

      expect(mockGetOneFn).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('debería retornar un UserEntity si se encuentra un usuario por id', async () => {
      mockUserMapper.fromOrmEntityToDomain.mockReturnValue(mockDomainEntity);
      mockGetOneFn.mockResolvedValue(mockUserOrmEntity);
      const result = await repository.findById(mockDomainEntity.id);

      expect(mockGetOneFn).toHaveBeenCalled();
      expect(mockUserMapper.fromOrmEntityToDomain).toHaveBeenCalledWith(
        mockUserOrmEntity,
      );
      expect(result).toEqual(mockDomainEntity);
    });
  });

  describe('save', () => {
    it('debería guardar un usuario correctamente', async () => {
      mockRoleRepo.findOne.mockResolvedValueOnce(mockUserOrmEntity.role);
      mockUserRepo.create.mockReturnValueOnce(mockUserOrmEntity);

      await repository.save(mockDomainEntity);

      expect(mockRoleRepo.findOne).toHaveBeenCalledWith({
        where: { name: mockDomainEntity.role.name },
      });
      expect(mockUserRepo.create).toHaveBeenCalledWith({
        ...mockDomainEntity,
        role: mockUserOrmEntity.role,
      });

      expect(mockUserRepo.save).toHaveBeenCalledWith(mockUserOrmEntity);
    });
  });
});
