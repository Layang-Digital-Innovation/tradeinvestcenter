"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        var _a, _b;
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const fullname = ((_b = (_a = data.fullname) !== null && _a !== void 0 ? _a : data.fullName) !== null && _b !== void 0 ? _b : '').toString();
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
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findAllByRole(role) {
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
    async updateKycDocs(userId, kycDocs) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { kycDocs },
        });
    }
    async findAll(params) {
        const { page = 1, limit = 10, search, role } = params;
        const skip = (page - 1) * limit;
        const where = {};
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
        const mappedUsers = users.map((u) => (Object.assign(Object.assign({}, u), { fullName: u.fullname })));
        return {
            users: mappedUsers,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findAllExcludingSuperAdmin(params) {
        const { page = 1, limit = 10, search, role } = params;
        const skip = (page - 1) * limit;
        const where = {
            role: {
                not: client_1.Role.SUPER_ADMIN,
            },
        };
        if (search) {
            where.email = {
                contains: search,
                mode: 'insensitive',
            };
        }
        if (role && role !== client_1.Role.SUPER_ADMIN) {
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
        const mappedUsers = users.map((u) => (Object.assign(Object.assign({}, u), { fullName: u.fullname })));
        return {
            users: mappedUsers,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async update(id, data) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (data.email && data.email !== user.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        const updateData = {};
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
    async delete(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.prisma.user.delete({
            where: { id },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map