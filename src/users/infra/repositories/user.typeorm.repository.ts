import { IUserRepository } from '../../application/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrmEntity } from '../orm/user.orm-entity';
import { Repository } from 'typeorm';
import { RoleOrmEntity } from '../orm/role.orm-entity';
import { UserEntity } from '../../domain/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepository: Repository<RoleOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const entity = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('user.email = :email', { email })
      .getOne();
    return entity ? UserMapper.mapToDomain(entity) : null;
  }

  async findById(id: number): Promise<UserEntity | null> {
    const entity = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('user.id = :id', { id })
      .getOne();
    return entity ? UserMapper.mapToDomain(entity) : null;
  }

  async save(user: Omit<UserEntity, 'id'>): Promise<void> {
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
