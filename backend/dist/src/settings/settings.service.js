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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SettingsService = class SettingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPlatformBankSettings() {
        const rec = await this.prisma.platformSettings.findUnique({ where: { id: 'platform_settings' } });
        return rec || { id: 'platform_settings', bankName: null, accountName: null, accountNumber: null, instruction: null };
    }
    async upsertPlatformBankSettings(data, updatedByUserId) {
        var _a, _b, _c, _d;
        const now = new Date();
        const payload = {
            bankName: (_a = data.bankName) !== null && _a !== void 0 ? _a : null,
            accountName: (_b = data.accountName) !== null && _b !== void 0 ? _b : null,
            accountNumber: (_c = data.accountNumber) !== null && _c !== void 0 ? _c : null,
            instruction: (_d = data.instruction) !== null && _d !== void 0 ? _d : null,
            updatedByUserId: updatedByUserId || null,
            updatedAt: now,
        };
        const res = await this.prisma.platformSettings.upsert({
            where: { id: 'platform_settings' },
            update: payload,
            create: Object.assign(Object.assign({ id: 'platform_settings' }, payload), { createdAt: now }),
        });
        return res;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map