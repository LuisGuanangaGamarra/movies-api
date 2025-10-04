import { RoleEntity } from '../role.entity';

export interface IRoleRepository {
  findByName(name: string): Promise<RoleEntity | null>;
}

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');
