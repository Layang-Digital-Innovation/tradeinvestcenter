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
exports.TradingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TradingService = class TradingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProduct(sellerId, data) {
        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                unit: data.unit,
                weight: data.weight,
                volume: data.volume,
                sellerId,
                prices: {
                    create: data.prices.map(p => ({ currency: p.currency, price: p.price })),
                },
            },
            include: { prices: true },
        });
    }
    async updateShipment(id, data) {
        var _a, _b;
        const shipment = await this.prisma.shipment.findUnique({ where: { id } });
        if (!shipment)
            throw new common_1.NotFoundException('Shipment not found');
        return this.prisma.shipment.update({
            where: { id },
            data: {
                method: (_a = data.method) !== null && _a !== void 0 ? _a : shipment.method,
                carrier: data.carrier !== undefined ? data.carrier : shipment.carrier,
                trackingNumber: data.trackingNumber !== undefined ? data.trackingNumber : shipment.trackingNumber,
                trackingUrl: data.trackingUrl !== undefined ? data.trackingUrl : shipment.trackingUrl,
                status: (_b = data.status) !== null && _b !== void 0 ? _b : shipment.status,
                seaPricingMode: data.seaPricingMode !== undefined ? data.seaPricingMode : shipment.seaPricingMode,
                cbmVolume: data.cbmVolume !== undefined ? data.cbmVolume : shipment.cbmVolume,
                containerType: data.containerType !== undefined ? data.containerType : shipment.containerType,
                freightCost: data.freightCost !== undefined ? data.freightCost : shipment.freightCost,
                currency: data.currency !== undefined ? data.currency : shipment.currency,
            },
        });
    }
    async getApprovedProducts(filters) {
        const where = { status: client_1.ProductStatus.APPROVED };
        if (filters === null || filters === void 0 ? void 0 : filters.sellerId)
            where.sellerId = filters.sellerId;
        return this.prisma.product.findMany({
            where,
            include: {
                seller: {
                    select: { id: true, email: true, fullname: true, SellerProfile: true },
                },
                images: true,
                prices: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getProductById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                seller: { select: { id: true, email: true, fullname: true, SellerProfile: true } },
                images: true,
                prices: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async updateProduct(id, sellerId, data) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('You do not have permission to update this product');
        }
        const _a = data, { prices } = _a, rest = __rest(_a, ["prices"]);
        const updated = await this.prisma.product.update({
            where: { id },
            data: rest,
        });
        if (Array.isArray(prices)) {
            await this.prisma.productPrice.deleteMany({ where: { productId: id } });
            if (prices.length) {
                await this.prisma.productPrice.createMany({
                    data: prices.map((p) => ({ productId: id, currency: p.currency, price: p.price })),
                    skipDuplicates: true,
                });
            }
        }
        return this.prisma.product.findUnique({ where: { id }, include: { prices: true } });
    }
    async getSellerProducts(sellerId) {
        return this.prisma.product.findMany({
            where: { sellerId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAllProducts() {
        return this.prisma.product.findMany({
            include: {
                seller: { select: { id: true, email: true, fullname: true } },
                images: true,
                prices: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async approveProduct(id, adminUserId) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return this.prisma.product.update({
            where: { id },
            data: { status: client_1.ProductStatus.APPROVED, approvedBy: adminUserId, approvedAt: new Date() },
        });
    }
    async rejectProduct(id, adminUserId, reason) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return this.prisma.product.update({
            where: { id },
            data: { status: client_1.ProductStatus.REJECTED, approvedBy: adminUserId, approvedAt: new Date(), description: reason ? `${product.description}\n\n[Rejected]: ${reason}` : product.description },
        });
    }
    async createOrder(buyerId, data) {
        const product = await this.prisma.product.findUnique({
            where: { id: data.productId },
            include: { prices: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const priceRow = product.prices.find((pp) => pp.currency === data.currency);
        if (!priceRow)
            throw new common_1.NotFoundException('Price not available for selected currency');
        const pricePerUnit = priceRow.price;
        const totalPrice = pricePerUnit * data.quantity;
        const order = await this.prisma.order.create({
            data: {
                productId: data.productId,
                buyerId,
                quantity: data.quantity,
                notes: data.notes,
                currency: data.currency,
                pricePerUnit,
                totalPrice,
            },
            include: {
                product: { include: { prices: true } },
            },
        });
        const admins = await this.prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
        const superAdmins = await this.prisma.user.findMany({ where: { role: 'SUPER_ADMIN' }, select: { id: true } });
        const notifyUsers = [...admins, ...superAdmins];
        if (notifyUsers.length) {
            await this.prisma.notification.createMany({
                data: notifyUsers.map(u => ({
                    userId: u.id,
                    title: 'New Trading Order',
                    message: `A new order has been placed for product ${product.name} (${data.currency})`,
                    type: 'TRADING_ORDER',
                    relatedId: order.id,
                })),
                skipDuplicates: true,
            });
        }
        return order;
    }
    async getOrders(filters) {
        let where = {};
        if (filters === null || filters === void 0 ? void 0 : filters.buyerId) {
            where.buyerId = filters.buyerId;
        }
        if (filters === null || filters === void 0 ? void 0 : filters.sellerId) {
            where.product = {
                sellerId: filters.sellerId,
            };
        }
        if (filters === null || filters === void 0 ? void 0 : filters.status) {
            where.status = filters.status;
        }
        return this.prisma.order.findMany({
            where,
            include: {
                product: {
                    include: {
                        seller: {
                            select: {
                                id: true,
                                email: true,
                                fullname: true,
                            },
                        },
                        images: true,
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        email: true,
                        fullname: true,
                    },
                },
                shipment: true,
            },
        });
    }
    async getOrderById(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                product: {
                    include: {
                        seller: {
                            select: {
                                id: true,
                                email: true,
                                fullname: true,
                            },
                        },
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        email: true,
                        fullname: true,
                    },
                },
                shipment: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async updateOrderStatus(id, status) {
        const order = await this.prisma.order.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return this.prisma.order.update({
            where: { id },
            data: { status },
        });
    }
    async createShipment(orderId, data) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                shipment: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.shipment) {
            throw new common_1.ForbiddenException('Shipment already exists for this order');
        }
        return this.prisma.shipment.create({
            data: {
                method: data.method,
                orderId,
            },
        });
    }
    async updateShipmentStatus(id, status) {
        const shipment = await this.prisma.shipment.findUnique({
            where: { id },
        });
        if (!shipment) {
            throw new common_1.NotFoundException('Shipment not found');
        }
        return this.prisma.shipment.update({
            where: { id },
            data: { status },
        });
    }
    async getSellerProfile(userId) {
        const profile = await this.prisma.sellerProfile.findUnique({ where: { userId } });
        return profile || { userId, country: null, address: null, companyLogo: null, companyName: null, descriptions: null, profileCompanyUrl: null, profileCompanyFileName: null };
    }
    async getSellerProfileById(userId) {
        return this.getSellerProfile(userId);
    }
    async upsertSellerProfile(userId, data) {
        const existing = await this.prisma.sellerProfile.findUnique({ where: { userId } });
        if (existing) {
            return this.prisma.sellerProfile.update({ where: { userId }, data });
        }
        return this.prisma.sellerProfile.create({ data: Object.assign({ userId }, data) });
    }
    async listShippingMethods() {
        return [
            { code: 'AIR', label: 'Air Freight' },
            { code: 'SEA', label: 'Sea Freight (CBM/Container)' },
            { code: 'EXPRESS', label: 'Courier/Express (DHL/FedEx/UPS)' },
        ];
    }
    async attachProductImages(productId, sellerId, payload) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        if (product.sellerId !== sellerId)
            throw new common_1.ForbiddenException('Not owner of product');
        if (payload.cover) {
            await this.prisma.productImage.updateMany({ where: { productId }, data: { isCover: false } });
            await this.prisma.productImage.create({
                data: {
                    productId,
                    url: payload.cover.url,
                    filename: payload.cover.filename,
                    originalName: payload.cover.originalName,
                    size: Math.round(payload.cover.size),
                    mimeType: payload.cover.mimeType,
                    isCover: true,
                },
            });
        }
        if (payload.previews && payload.previews.length) {
            await this.prisma.productImage.createMany({
                data: payload.previews.map((p) => ({
                    productId,
                    url: p.url,
                    filename: p.filename,
                    originalName: p.originalName,
                    size: Math.round(p.size),
                    mimeType: p.mimeType,
                    isCover: false,
                })),
                skipDuplicates: true,
            });
        }
        return this.prisma.product.findUnique({
            where: { id: productId },
            include: { images: true },
        });
    }
    async getAdminTradingAnalytics() {
        const [totalProducts, pendingProducts, totalOrders, byStatus, completedOrders] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.product.count({ where: { status: client_1.ProductStatus.PENDING } }),
            this.prisma.order.count(),
            this.prisma.order.groupBy({ by: ['status'], _count: { status: true } }),
            this.prisma.order.findMany({ where: { status: client_1.OrderStatus.COMPLETED }, select: { totalPrice: true } }),
        ]);
        const ordersByStatus = {};
        for (const row of byStatus) {
            ordersByStatus[row.status] = row._count.status;
        }
        const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        return { totalProducts, pendingProducts, totalOrders, ordersByStatus, totalRevenue };
    }
    async getBuyerAnalytics(buyerId) {
        const [totalOrders, pendingOrders, myOrders] = await Promise.all([
            this.prisma.order.count({ where: { buyerId } }),
            this.prisma.order.count({ where: { buyerId, status: client_1.OrderStatus.PENDING } }),
            this.prisma.order.findMany({ where: { buyerId }, include: { product: { select: { name: true, images: true, seller: { select: { email: true, fullname: true } } } }, shipment: true }, orderBy: { createdAt: 'desc' }, take: 10 }),
        ]);
        const totalSpent = myOrders
            .filter((o) => o.status === client_1.OrderStatus.COMPLETED || o.status === client_1.OrderStatus.SHIPPED)
            .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        return { totalOrders, pendingOrders, totalSpent, recentOrders: myOrders };
    }
    async getSellerAnalytics(sellerId) {
        var _a;
        const [totalProducts, orders, pendingShipments] = await Promise.all([
            this.prisma.product.count({ where: { sellerId } }),
            this.prisma.order.findMany({ where: { product: { sellerId } }, include: { product: { select: { name: true } }, buyer: { select: { email: true, fullname: true } }, shipment: true }, orderBy: { createdAt: 'desc' } }),
            this.prisma.shipment.count({ where: { status: 'PENDING', order: { product: { sellerId } } } }),
        ]);
        const totalOrders = orders.length;
        const totalRevenue = orders
            .filter((o) => o.status === client_1.OrderStatus.COMPLETED)
            .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        const recentOrders = orders.slice(0, 10);
        const map = {};
        for (const o of orders) {
            const pid = o.productId;
            if (!map[pid])
                map[pid] = { name: ((_a = o.product) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown', count: 0, revenue: 0 };
            map[pid].count += 1;
            if (o.status === client_1.OrderStatus.COMPLETED) {
                map[pid].revenue += o.totalPrice || 0;
            }
        }
        const topProducts = Object.entries(map)
            .map(([id, v]) => ({ id, name: v.name, sold: v.count, revenue: v.revenue }))
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10);
        return { totalProducts, totalOrders, totalRevenue, pendingShipments, recentOrders, topProducts };
    }
};
exports.TradingService = TradingService;
exports.TradingService = TradingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TradingService);
//# sourceMappingURL=trading.service.js.map