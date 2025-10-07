import { IUserRepository } from '../../domain/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrmEntity } from '../orm/user.orm-entity';
import { Repository } from 'typeorm';
import { RoleOrmEntity } from '../orm/role.orm-entity';
import { UserEntity } from '../../domain/user.entity';
import { Injectable, Inject } from '@nestjs/common';
import {
  USER_MAPPER,
  type IUserMapper,
} from '../../domain/interfaces/user.mapper';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepository: Repository<RoleOrmEntity>,
    @Inject(USER_MAPPER)
    private readonly userMapper: IUserMapper,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const entity = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('user.email = :email', { email })
      .getOne();
    return entity ? this.userMapper.fromOrmEntityToDomain(entity) : null;
  }

  async findById(id: number): Promise<UserEntity | null> {
    const entity = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('user.id = :id', { id })
      .getOne();
    return entity ? this.userMapper.fromOrmEntityToDomain(entity) : null;
  }

  async save(user: UserEntity | Omit<UserEntity, 'id'>): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { name: user.role.name },
    });

    const entity = this.userRepository.create({
      ...user,
      role: role!,
    });

    await this.userRepository.save(entity);
  }
}
