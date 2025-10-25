import { ChatType } from '@prisma/client';
export declare class CreateChatDto {
    adminId?: string;
    projectId?: string;
    type?: ChatType;
}
