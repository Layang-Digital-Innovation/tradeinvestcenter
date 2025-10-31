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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradingController = void 0;
const common_1 = require("@nestjs/common");
const trading_service_1 = require("./trading.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let TradingController = class TradingController {
    constructor(tradingService) {
        this.tradingService = tradingService;
    }
    async createProduct(req, data) {
        return this.tradingService.createProduct(req.user.id, data);
    }
    async getApprovedProducts(sellerId) {
        return this.tradingService.getApprovedProducts({ sellerId });
    }
    async getProductById(id) {
        return this.tradingService.getProductById(id);
    }
    async updateProduct(req, id, data) {
        return this.tradingService.updateProduct(id, req.user.id, data);
    }
    async getSellerProducts(req) {
        return this.tradingService.getSellerProducts(req.user.id);
    }
    async getAllProductsAdmin() {
        return this.tradingService.getAllProducts();
    }
    async attachProductImages(req, id, body) {
        return this.tradingService.attachProductImages(id, req.user.id, body);
    }
    async approveProduct(req, id) {
        return this.tradingService.approveProduct(id, req.user.id);
    }
    async rejectProduct(req, id, reason) {
        return this.tradingService.rejectProduct(id, req.user.id, reason);
    }
    async createOrder(req, data) {
        return this.tradingService.createOrder(req.user.id, data);
    }
    async getOrders(req, status) {
        const filters = {};
        if (req.user.role === client_1.Role.BUYER) {
            filters.buyerId = req.user.id;
        }
        else if (req.user.role === client_1.Role.SELLER) {
            filters.sellerId = req.user.id;
        }
        if (status) {
            filters.status = status;
        }
        return this.tradingService.getOrders(filters);
    }
    async getOrderById(id) {
        return this.tradingService.getOrderById(id);
    }
    async updateOrderStatus(id, status) {
        return this.tradingService.updateOrderStatus(id, status);
    }
    async setOrderFixedPrices(id, body) {
        return this.tradingService.setOrderFixedPrices(id, body);
    }
    async createShipment(orderId, data) {
        return this.tradingService.createShipment(orderId, data);
    }
    async updateShipmentStatus(id, status) {
        return this.tradingService.updateShipmentStatus(id, status);
    }
    async updateShipment(id, body) {
        return this.tradingService.updateShipment(id, body);
    }
    async getSellerProfile(req) {
        return this.tradingService.getSellerProfile(req.user.id);
    }
    async upsertSellerProfile(req, data) {
        return this.tradingService.upsertSellerProfile(req.user.id, data);
    }
    async getSellerProfileById(userId) {
        return this.tradingService.getSellerProfileById(userId);
    }
    async listShippingMethods() {
        return this.tradingService.listShippingMethods();
    }
    async adminAnalytics() {
        return this.tradingService.getAdminTradingAnalytics();
    }
    async buyerAnalytics(req) {
        return this.tradingService.getBuyerAnalytics(req.user.id);
    }
    async sellerAnalytics(req) {
        return this.tradingService.getSellerAnalytics(req.user.id);
    }
};
exports.TradingController = TradingController;
__decorate([
    (0, common_1.Post)('products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)('products'),
    __param(0, (0, common_1.Query)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "getApprovedProducts", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Put)('products/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Get)('seller/products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "getSellerProducts", null);
__decorate([
    (0, common_1.Get)('admin/products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ADMIN_TRADING, client_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "getAllProductsAdmin", null);
__decorate([
    (0, common_1.Put)('products/:id/images'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "attachProductImages", null);
__decorate([
    (0, common_1.Put)('admin/products/:id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ADMIN_TRADING, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "approveProduct", null);
__decorate([
    (0, common_1.Put)('admin/products/:id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ADMIN_TRADING, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "rejectProduct", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.BUYER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Put)('orders/:id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER, client_1.Role.ADMIN, client_1.Role.ADMIN_TRADING),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Put)('orders/:id/fixed-prices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ADMIN_TRADING, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "setOrderFixedPrices", null);
__decorate([
    (0, common_1.Post)('orders/:orderId/shipment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER, client_1.Role.ADMIN, client_1.Role.ADMIN_TRADING),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "createShipment", null);
__decorate([
    (0, common_1.Put)('shipments/:id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER, client_1.Role.ADMIN, client_1.Role.ADMIN_TRADING),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "updateShipmentStatus", null);
__decorate([
    (0, common_1.Put)('shipments/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER, client_1.Role.ADMIN, client_1.Role.ADMIN_TRADING),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "updateShipment", null);
__decorate([
    (0, common_1.Get)('seller/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "getSellerProfile", null);
__decorate([
    (0, common_1.Put)('seller/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "upsertSellerProfile", null);
__decorate([
    (0, common_1.Get)('seller/:userId/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.BUYER, client_1.Role.ADMIN, client_1.Role.ADMIN_TRADING, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "getSellerProfileById", null);
__decorate([
    (0, common_1.Get)('shipping/methods'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "listShippingMethods", null);
__decorate([
    (0, common_1.Get)('admin/analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ADMIN_TRADING, client_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "adminAnalytics", null);
__decorate([
    (0, common_1.Get)('buyer/analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.BUYER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "buyerAnalytics", null);
__decorate([
    (0, common_1.Get)('seller/analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TradingController.prototype, "sellerAnalytics", null);
exports.TradingController = TradingController = __decorate([
    (0, common_1.Controller)('trading'),
    __metadata("design:paramtypes", [trading_service_1.TradingService])
], TradingController);
//# sourceMappingURL=trading.controller.js.map