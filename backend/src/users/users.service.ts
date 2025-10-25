import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; password: string; role: Role; kycDocs?: string; fullname?: string }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const fullname = (data.fullname ?? (data as any).fullName ?? '').toString();

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role,
        fullname,
        kycDocs: data.kycDocs || null,
      },
    });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }
  
  async findAllByRole(role: Role) {
    const users = await this.prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        email: true,
        role: true,
      }
    });
    
    return users;
  }

  async updateKycDocs(userId: string, kycDocs: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { kycDocs },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: Role;
  }) {
    const { page = 1, limit = 10, search, role } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.email = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          role: true,
          fullname: true,
          kycDocs: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const mappedUsers = users.map((u: any) => ({
      ...u,
      fullName: u.fullname,
    }));

    return {
      users: mappedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllExcludingSuperAdmin(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: Role;
  }) {
    const { page = 1, limit = 10, search, role } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      role: {
        not: Role.SUPER_ADMIN, // Exclude SUPER_ADMIN users
      },
    };

    if (search) {
      where.email = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (role && role !== Role.SUPER_ADMIN) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          role: true,
          fullname: true,
          kycDocs: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const mappedUsers = users.map((u: any) => ({
      ...u,
      fullName: u.fullname,
    }));

    return {
      users: mappedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: { email?: string; password?: string; role?: Role; kycDocs?: string; fullname?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being updated and if it already exists
    if (data.email && data.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    const updateData: any = {};

    if (data.email) {
      updateData.email = data.email;
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    if (data.role) {
      updateData.role = data.role;
    }

    if (data.kycDocs !== undefined) {
      updateData.kycDocs = data.kycDocs;
    }
    
    if (data.fullname !== undefined) {
      updateData.fullname = data.fullname;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        kycDocs: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}