import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            fullname: any;
            role: any;
        };
    }>;
    register(registerDto: {
        email: string;
        password: string;
        fullname?: string;
        name?: string;
        role?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        fullname: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string | null;
    }>;
    testAuth(req: any): Promise<{
        message: string;
        user: any;
    }>;
}
