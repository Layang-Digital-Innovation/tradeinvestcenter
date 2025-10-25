import { UsersService } from './users.service';
import { Role } from '@prisma/client';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        fullname: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateKycDocs(req: any, data: {
        idCardUrl: string;
        selfieUrl: string;
    }): Promise<{
        id: string;
        email: string;
        fullname: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, data: {
        email?: string;
        password?: string;
        fullname?: string;
    }): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUsersForAdmin(page?: string, limit?: string, search?: string, role?: Role): Promise<{
        users: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAllUsers(page?: string, limit?: string, search?: string, role?: Role): Promise<{
        users: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    createUser(data: {
        email: string;
        password: string;
        role: Role;
        kycDocs?: string;
    }): Promise<{
        id: string;
        email: string;
        fullname: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserById(id: string): Promise<{
        id: string;
        email: string;
        fullname: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: string, data: {
        email?: string;
        password?: string;
        role?: Role;
        kycDocs?: string;
        fullname?: string;
    }): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        id: string;
        email: string;
        fullname: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
