import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../../users/application/user.repository';

import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './types';
import { type LoginDtoResponse } from '../../dtos/auth.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({ email, password }: LoginInput): Promise<LoginDtoResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new BadRequestException('Usuario no encontrado');

    const isEqual = await bcrypt.compare(password, user.passwordHash);
    if (!isEqual) throw new BadRequestException('email o password incorrectos');

    const payload = { sub: user.id, email: user.email, role: user.role.name };
    const jwt = await this.jwtService.signAsync(payload);
    const response: LoginDtoResponse = {
      token: jwt,
    };

    return response;
  }
}
