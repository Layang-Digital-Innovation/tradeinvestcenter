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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const subscription_service_1 = require("../subscription/subscription.service");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(usersService, jwtService, subscriptionService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.subscriptionService = subscriptionService;
    }
    async validateUser(email, password) {
        try {
            const user = await this.usersService.findByEmail(email);
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                const { password } = user, result = __rest(user, ["password"]);
                return result;
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        try {
            if (user.role !== client_1.Role.ADMIN) {
                await this.subscriptionService.startTrialForEligibleUser(user.id, user.role);
            }
        }
        catch (err) {
        }
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                fullname: user.fullname,
                role: user.role,
            },
        };
    }
    async register(email, password, role, fullname) {
        const user = await this.usersService.create({
            email,
            password,
            role,
            fullname,
        });
        try {
            await this.subscriptionService.startTrialForEligibleUser(user.id, role || client_1.Role.INVESTOR);
        }
        catch (err) {
            console.error('Failed to start trial for user', user.id, err);
        }
        const { password: _ } = user, result = __rest(user, ["password"]);
        return result;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        subscription_service_1.SubscriptionService])
], AuthService);
//# sourceMappingURL=auth.service.js.map