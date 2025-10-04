import { UserEntity } from '../domain/user.entity';

export interface IUserRepository {
  save(user: UserEntity): Promise<void>;
  findById(id: number): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
