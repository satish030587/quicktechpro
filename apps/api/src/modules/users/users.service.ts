import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }, include: { roles: { include: { role: true } }, totpSecret: true } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id }, include: { roles: { include: { role: true } }, totpSecret: true } });
  }

  async createUser(data: { email: string; passwordHash: string; name?: string; defaultRole?: string }) {
    const roleName = data.defaultRole ?? 'customer';
    const role = await this.prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName }
    });
    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        roles: { create: [{ roleId: role.id }] }
      },
      include: { roles: { include: { role: true } } }
    });
  }
}

