import { PermissionEntity } from './permission.entity';
export class RoleEntity {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly permission: PermissionEntity[] = [],
  ) {}
}
