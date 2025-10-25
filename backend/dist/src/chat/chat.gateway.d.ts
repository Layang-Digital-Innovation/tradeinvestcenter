import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
interface AuthedSocket extends Socket {
    user?: {
        id: string;
        email?: string;
        role?: string;
    };
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwt;
    private chatService;
    server: Server;
    private readonly logger;
    constructor(jwt: JwtService, chatService: ChatService);
    handleConnection(client: AuthedSocket): Promise<void>;
    handleDisconnect(client: AuthedSocket): Promise<void>;
    onJoinRoom(client: AuthedSocket, payload: {
        chatId: string;
    }): Promise<AuthedSocket>;
    onTyping(client: AuthedSocket, payload: {
        chatId: string;
        typing: boolean;
    }): Promise<void>;
    onSendMessage(client: AuthedSocket, payload: {
        chatId: string;
        content: string;
    }): Promise<AuthedSocket | {
        ok: boolean;
    }>;
    private extractToken;
}
export {};
