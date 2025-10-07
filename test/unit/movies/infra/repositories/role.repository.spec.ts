import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { RoleTypeormRepository } from 'src/users/infra/repositories/role.typeorm.repository';
import { RoleOrmEntity } from 'src/users/infra/orm/role.orm-entity';
import { RoleEntity } from 'src/users/domain/role.entity';
import { PermissionEntity } from 'src/users/domain/permission.entity';

describe('RoleTypeormRepository', () => {
  let repository: RoleTypeormRepository;
  let mockRoleRepo: jest.Mocked<Repository<RoleOrmEntity>>;

  beforeEach(async () => {
    mockRoleRepo = {
      findOne: jest.fn(),
    } as Partial<Repository<RoleOrmEntity>> as jest.Mocked<
      Repository<RoleOrmEntity>
    >;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleTypeormRepository,
        {
          provide: getRepositoryToken(RoleOrmEntity),
          useValue: mockRoleRepo,
        },
      ],
    }).compile();

    repository = module.get<RoleTypeormRepository>(RoleTypeormRepository);
  });

  describe('findByName', () => {
    it('debería devolver null si no se encuentra el rol por nombre', async () => {
      const roleName = 'admin';
      mockRoleRepo.findOne.mockResolvedValue(null);

      const result = await repository.findByName(roleName);

      expect(mockRoleRepo.findOne).toHaveBeenCalledWith({
        where: { name: roleName },
        relations: ['permissions'],
      });
      expect(result).toBeNull();
    });

    it('debería convertir RoleOrmEntity a RoleEntity correctamente si se encuentra el rol', async () => {
      const roleName = 'admin';
      const mockRoleOrmEntity: RoleOrmEntity = new RoleOrmEntity();
      Object.assign(mockRoleOrmEntity, {
        id: 1,
        name: 'admin',
        permissions: [
          { id: 101, name: 'READ_ONLY' },
          { id: 102, name: 'WRITE' },
        ],
      });

      const expectedRoleEntity = new RoleEntity(1, 'admin', [
        new PermissionEntity(101, 'READ_ONLY'),
        new PermissionEntity(102, 'WRITE'),
      ]);

      mockRoleRepo.findOne.mockResolvedValue(mockRoleOrmEntity);

      const result = await repository.findByName(roleName);

      expect(mockRoleRepo.findOne).toHaveBeenCalledWith({
        where: { name: roleName },
        relations: ['permissions'],
      });
      expect(result).toEqual(expectedRoleEntity);
    });

    it('debería convertir RoleOrmEntity a RoleEntity correctamente si se encuentra el rol sin permisos', async () => {
      const roleName = 'admin';
      const mockRoleOrmEntity: RoleOrmEntity = new RoleOrmEntity();
      Object.assign(mockRoleOrmEntity, {
        id: 1,
        name: 'admin',
        permissions: [],
      });

      const expectedRoleEntity = new RoleEntity(1, 'admin', undefined);

      mockRoleRepo.findOne.mockResolvedValue(mockRoleOrmEntity);

      const result = await repository.findByName(roleName);

      expect(mockRoleRepo.findOne).toHaveBeenCalledWith({
        where: { name: roleName },
        relations: ['permissions'],
      });
      expect(result).toEqual(expectedRoleEntity);
    });
  });
});
