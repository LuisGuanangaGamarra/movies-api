import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../../users/domain/repositories/user.repository';
import { LoginInputApplicationDTO } from '../dtos/login-input-application.dto';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';
import { LoginOutputApplicationDTO } from '../dtos/login-ouput-application.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({
    email,
    password,
  }: LoginInputApplicationDTO): Promise<LoginOutputApplicationDTO> {
    const user = await this.userRepository.findByEmail(email);
    if (!user)
      throw new DomainException('USER_NOT_FOUND', 'Usuario no encontrado', {
        email,
      });

    const isEqual = await bcrypt.compare(password, user.passwordHash);
    if (!isEqual)
      throw new DomainException(
        'INVALID_CREDENTIALS',
        'email o password invalido',
        {
          email,
          password,
        },
      );

    const payload = { sub: user.id, email: user.email, role: user.role.name };
    const jwt = await this.jwtService.signAsync(payload);

    return {
      token: jwt,
    };
  }
}
