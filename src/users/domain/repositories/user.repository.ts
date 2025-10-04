import { UserEntity } from '../user.entity';

export interface IUserRepository {
  save(user: UserEntity | Omit<UserEntity, 'id'>): Promise<void>;
  findById(id: number): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
