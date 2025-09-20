import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user as any;
    const userRoles: string[] = user?.roles || [];
    const ok = roles.some(r => userRoles.includes(r));
    // Enforce 2FA for admin endpoints
    if (ok && roles.includes('admin')) {
      if (!user?.tfa) return false;
    }
    return ok;
  }
}
