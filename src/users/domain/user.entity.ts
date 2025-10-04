import { RoleEntity } from './role.entity';

export class UserEntity {
  constructor(
    readonly id: number,
    readonly email: string,
    readonly passwordHash: string,
    readonly role: RoleEntity,
  ) {}
}
