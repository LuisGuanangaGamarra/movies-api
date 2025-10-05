import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RegisterInputDTO } from './dtos/dtos';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../../users/domain/repositories/user.repository';
import {
  type IRoleRepository,
  ROLE_REPOSITORY,
} from '../../../users/domain/repositories/role.repository';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}
  async execute(input: RegisterInputDTO) {
    const { email, password, role } = input;
    const user = await this.userRepository.findByEmail(email);
    if (user)
      throw new DomainException('USER_ALREADY_EXISTS', 'email ya registrado', {
        email,
      });

    const rol = await this.roleRepository.findByName(role);
    if (!role) throw new DomainException('ROLE_NOT_FOUND', 'rol no encontrado');

    const hash = await bcrypt.hash(password, 12);

    const userToSave = {
      email,
      passwordHash: hash,
      role: rol!,
    };
    await this.userRepository.save(userToSave);
  }
}
