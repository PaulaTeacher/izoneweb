import { SetMetadata } from '@nestjs/common';

// @Public() — marks an endpoint as accessible without authentication
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// @Roles('SUPERADMIN', 'EDITOR') — restricts to specific roles
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
