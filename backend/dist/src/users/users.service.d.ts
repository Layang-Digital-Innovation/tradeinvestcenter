import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        email: string;
        password: string;
        role: Role;
        kycDocs?: string;
        fullname?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        fullname: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string | null;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        fullname: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string | null;
    }>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        fullname: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string | null;
    }>;
    findAllByRole(role: Role): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    updateKycDocs(userId: string, kycDocs: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        fullname: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string | null;
    }>;
    findAll(params: {
        page?: number;
        limit?: number;
        search?: string;
        role?: Role;
    }): Promise<{
        users: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAllExcludingSuperAdmin(params: {
        page?: number;
        limit?: number;
        search?: string;
        role?: Role;
    }): Promise<{
        users: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    update(id: string, data: {
        email?: string;
        password?: string;
        role?: Role;
        kycDocs?: string;
        fullname?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        fullname: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string | null;
    }>;
}
