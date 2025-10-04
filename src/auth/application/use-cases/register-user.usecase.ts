import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterInput } from './types';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../../users/application/user.repository';
import {
  type IRoleRepository,
  ROLE_REPOSITORY,
} from '../../../users/application/role.repository';

import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}
  async execute(input: RegisterInput) {
    const { email, password, role } = input;
    const user = await this.userRepository.findByEmail(email);
    if (user) throw new BadRequestException('El usuario ya existe');

    const rol = await this.roleRepository.findByName(role);
    if (!role) throw new BadRequestException('El rol no existe');

    const hash = await bcrypt.hash(password, 12);

    const userToSave = {
      email,
      passwordHash: hash,
      role: rol!,
    };
    await this.userRepository.save(userToSave);
  }
}
