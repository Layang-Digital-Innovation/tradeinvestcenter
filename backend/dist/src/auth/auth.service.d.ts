import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SubscriptionService } from '../subscription/subscription.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private subscriptionService;
    constructor(usersService: UsersService, jwtService: JwtService, subscriptionService: SubscriptionService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        fullname: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string | null;
    }>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            fullname: any;
            role: any;
        };
    }>;
    register(email: string, password: string, role: any, fullname?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        fullname: string;
        role: import(".prisma/client").$Enums.Role;
        kycDocs: string | null;
    }>;
}
