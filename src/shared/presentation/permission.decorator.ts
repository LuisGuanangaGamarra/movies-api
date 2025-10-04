import { SetMetadata } from '@nestjs/common';

export const PERMISSION_DECORATOR_KEY = 'permisos';

export const Permission = (...permission: string[]) =>
  SetMetadata(PERMISSION_DECORATOR_KEY, permission);
