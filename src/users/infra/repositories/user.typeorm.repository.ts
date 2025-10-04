import { IUserRepository } from '../../application/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrmEntity } from '../orm/user.orm-entity';
import { Repository } from 'typeorm';
import { RoleOrmEntity } from '../orm/role.orm-entity';
import { UserEntity } from '../../domain/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepository: Repository<RoleOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const entity = await this.userRepository.findOne({ where: { email } });
    return entity ? UserMapper.mapToDomain(entity) : null;
  }

  async findById(id: number): Promise<UserEntity | null> {
    const entity = await this.userRepository.findOne({ where: { id } });
    return entity ? UserMapper.mapToDomain(entity) : null;
  }

  async save(user: UserEntity): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { name: user.role.name },
    });
    if (!role) throw new BadRequestException(`Rol ${user.role.name} no existe`);

    const entity = this.userRepository.create({
      ...user,
      role,
    });
    await this.userRepository.save(entity);
  }
}
