import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, ShipmentMethod, ShipmentStatus } from '@prisma/client';
export declare class TradingService {
    private prisma;
    constructor(prisma: PrismaService);
    createProduct(sellerId: string, data: {
        name: string;
        description: string;
        prices: Array<{
            currency: 'IDR' | 'USD';
            price: number;
        }>;
        unit: string;
        weight: number;
        volume: string;
    }): Promise<{
        prices: {
            id: string;
            price: number;
            currency: import(".prisma/client").$Enums.Currency;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        price: number | null;
        currency: string | null;
        unit: string;
        weight: number;
        volume: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProductStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        priceType: import(".prisma/client").$Enums.PriceType;
        sellerId: string;
    }>;
    updateShipment(id: string, data: {
        method?: ShipmentMethod;
        carrier?: string | null;
        trackingNumber?: string | null;
        trackingUrl?: string | null;
        status?: ShipmentStatus;
        seaPricingMode?: any;
        cbmVolume?: number | null;
        containerType?: any;
        freightCost?: number | null;
        currency?: string | null;
    }): Promise<{
        id: string;
        currency: import(".prisma/client").$Enums.Currency | null;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ShipmentStatus;
        updatedAt: Date;
        orderId: string;
        method: import(".prisma/client").$Enums.ShipmentMethod;
        carrier: string | null;
        trackingNumber: string | null;
        trackingUrl: string | null;
        seaPricingMode: import(".prisma/client").$Enums.SeaPricingMode | null;
        cbmVolume: number | null;
        containerType: import(".prisma/client").$Enums.ContainerType | null;
        freightCost: number | null;
    }>;
    getApprovedProducts(filters?: {
        sellerId?: string;
    }): Promise<({
        prices: {
            id: string;
            price: number;
            currency: import(".prisma/client").$Enums.Currency;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
        }[];
        seller: {
            id: string;
            email: string;
            fullname: string;
            SellerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                country: string | null;
                address: string | null;
                companyLogo: string | null;
                companyName: string | null;
                descriptions: string | null;
                profileCompanyUrl: string | null;
                profileCompanyFileName: string | null;
            };
        };
        images: {
            id: string;
            createdAt: Date;
            productId: string;
            url: string;
            filename: string;
            originalName: string;
            size: number;
            mimeType: string;
            isCover: boolean;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        price: number | null;
        currency: string | null;
        unit: string;
        weight: number;
        volume: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProductStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        priceType: import(".prisma/client").$Enums.PriceType;
        sellerId: string;
    })[]>;
    getProductById(id: string): Promise<{
        prices: {
            id: string;
            price: number;
            currency: import(".prisma/client").$Enums.Currency;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
        }[];
        seller: {
            id: string;
            email: string;
            fullname: string;
            SellerProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                country: string | null;
                address: string | null;
                companyLogo: string | null;
                companyName: string | null;
                descriptions: string | null;
                profileCompanyUrl: string | null;
                profileCompanyFileName: string | null;
            };
        };
        images: {
            id: string;
            createdAt: Date;
            productId: string;
            url: string;
            filename: string;
            originalName: string;
            size: number;
            mimeType: string;
            isCover: boolean;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        price: number | null;
        currency: string | null;
        unit: string;
        weight: number;
        volume: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProductStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        priceType: import(".prisma/client").$Enums.PriceType;
        sellerId: string;
    }>;
    updateProduct(id: string, sellerId: string, data: Partial<{
        name: string;
        description: string;
        prices: Array<{
            currency: 'IDR' | 'USD';
            price: number;
        }>;
        unit: string;
        weight: number;
        volume: string;
    }>): Promise<{
        prices: {
            id: string;
            price: number;
            currency: import(".prisma/client").$Enums.Currency;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        price: number | null;
        currency: string | null;
        unit: string;
        weight: number;
        volume: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProductStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        priceType: import(".prisma/client").$Enums.PriceType;
        sellerId: string;
    }>;
    getSellerProducts(sellerId: string): Promise<{
        id: string;
        name: string;
        description: string;
        price: number | null;
        currency: string | null;
        unit: string;
        weight: number;
        volume: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProductStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        priceType: import(".prisma/client").$Enums.PriceType;
        sellerId: string;
    }[]>;
    getAllProducts(): Promise<({
        prices: {
            id: string;
            price: number;
            currency: import(".prisma/client").$Enums.Currency;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
        }[];
        seller: {
            id: string;
            email: string;
            fullname: string;
        };
        images: {
            id: string;
            createdAt: Date;
            productId: string;
            url: string;
            filename: string;
            originalName: string;
            size: number;
            mimeType: string;
            isCover: boolean;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        price: number | null;
        currency: string | null;
        unit: string;
        weight: number;
        volume: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProductStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        priceType: import(".prisma/client").$Enums.PriceType;
        sellerId: string;
    })[]>;
    approveProduct(id: string, adminUserId: string): Promise<{
        id: string;
        name: string;
        description: string;
        price: number | null;
        currency: string | null;
        unit: string;
        weight: number;
        volume: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProductStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        priceType: import(".prisma/client").$Enums.PriceType;
        sellerId: string;
    }>;
    rejectProduct(id: string, adminUserId: string, reason?: string): Promise<{
        id: string;
        name: string;
        description: string;
        price: number | null;
        currency: string | null;
        unit: string;
        weight: number;
        volume: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProductStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        priceType: import(".prisma/client").$Enums.PriceType;
        sellerId: string;
    }>;
    createOrder(buyerId: string, data: {
        productId: string;
        quantity: number;
        notes?: string;
        currency: 'IDR' | 'USD';
    }): Promise<{
        product: {
            prices: {
                id: string;
                price: number;
                currency: import(".prisma/client").$Enums.Currency;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
            }[];
        } & {
            id: string;
            name: string;
            description: string;
            price: number | null;
            currency: string | null;
            unit: string;
            weight: number;
            volume: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ProductStatus;
            approvedBy: string | null;
            approvedAt: Date | null;
            priceType: import(".prisma/client").$Enums.PriceType;
            sellerId: string;
        };
    } & {
        id: string;
        currency: import(".prisma/client").$Enums.Currency;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        productId: string;
        quantity: number;
        notes: string | null;
        pricePerUnit: number;
        totalPrice: number;
        buyerId: string;
    }>;
    getOrders(filters?: {
        buyerId?: string;
        sellerId?: string;
        status?: OrderStatus;
    }): Promise<({
        product: {
            seller: {
                id: string;
                email: string;
                fullname: string;
            };
            images: {
                id: string;
                createdAt: Date;
                productId: string;
                url: string;
                filename: string;
                originalName: string;
                size: number;
                mimeType: string;
                isCover: boolean;
            }[];
        } & {
            id: string;
            name: string;
            description: string;
            price: number | null;
            currency: string | null;
            unit: string;
            weight: number;
            volume: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ProductStatus;
            approvedBy: string | null;
            approvedAt: Date | null;
            priceType: import(".prisma/client").$Enums.PriceType;
            sellerId: string;
        };
        shipment: {
            id: string;
            currency: import(".prisma/client").$Enums.Currency | null;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ShipmentStatus;
            updatedAt: Date;
            orderId: string;
            method: import(".prisma/client").$Enums.ShipmentMethod;
            carrier: string | null;
            trackingNumber: string | null;
            trackingUrl: string | null;
            seaPricingMode: import(".prisma/client").$Enums.SeaPricingMode | null;
            cbmVolume: number | null;
            containerType: import(".prisma/client").$Enums.ContainerType | null;
            freightCost: number | null;
        };
        buyer: {
            id: string;
            email: string;
            fullname: string;
        };
    } & {
        id: string;
        currency: import(".prisma/client").$Enums.Currency;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        productId: string;
        quantity: number;
        notes: string | null;
        pricePerUnit: number;
        totalPrice: number;
        buyerId: string;
    })[]>;
    getOrderById(id: string): Promise<{
        product: {
            seller: {
                id: string;
                email: string;
                fullname: string;
            };
        } & {
            id: string;
            name: string;
            description: string;
            price: number | null;
            currency: string | null;
            unit: string;
            weight: number;
            volume: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ProductStatus;
            approvedBy: string | null;
            approvedAt: Date | null;
            priceType: import(".prisma/client").$Enums.PriceType;
            sellerId: string;
        };
        shipment: {
            id: string;
            currency: import(".prisma/client").$Enums.Currency | null;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ShipmentStatus;
            updatedAt: Date;
            orderId: string;
            method: import(".prisma/client").$Enums.ShipmentMethod;
            carrier: string | null;
            trackingNumber: string | null;
            trackingUrl: string | null;
            seaPricingMode: import(".prisma/client").$Enums.SeaPricingMode | null;
            cbmVolume: number | null;
            containerType: import(".prisma/client").$Enums.ContainerType | null;
            freightCost: number | null;
        };
        buyer: {
            id: string;
            email: string;
            fullname: string;
        };
    } & {
        id: string;
        currency: import(".prisma/client").$Enums.Currency;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        productId: string;
        quantity: number;
        notes: string | null;
        pricePerUnit: number;
        totalPrice: number;
        buyerId: string;
    }>;
    updateOrderStatus(id: string, status: OrderStatus): Promise<{
        id: string;
        currency: import(".prisma/client").$Enums.Currency;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        productId: string;
        quantity: number;
        notes: string | null;
        pricePerUnit: number;
        totalPrice: number;
        buyerId: string;
    }>;
    createShipment(orderId: string, data: {
        method: ShipmentMethod;
    }): Promise<{
        id: string;
        currency: import(".prisma/client").$Enums.Currency | null;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ShipmentStatus;
        updatedAt: Date;
        orderId: string;
        method: import(".prisma/client").$Enums.ShipmentMethod;
        carrier: string | null;
        trackingNumber: string | null;
        trackingUrl: string | null;
        seaPricingMode: import(".prisma/client").$Enums.SeaPricingMode | null;
        cbmVolume: number | null;
        containerType: import(".prisma/client").$Enums.ContainerType | null;
        freightCost: number | null;
    }>;
    updateShipmentStatus(id: string, status: ShipmentStatus): Promise<{
        id: string;
        currency: import(".prisma/client").$Enums.Currency | null;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ShipmentStatus;
        updatedAt: Date;
        orderId: string;
        method: import(".prisma/client").$Enums.ShipmentMethod;
        carrier: string | null;
        trackingNumber: string | null;
        trackingUrl: string | null;
        seaPricingMode: import(".prisma/client").$Enums.SeaPricingMode | null;
        cbmVolume: number | null;
        containerType: import(".prisma/client").$Enums.ContainerType | null;
        freightCost: number | null;
    }>;
    getSellerProfile(userId: string): Promise<any>;
    getSellerProfileById(userId: string): Promise<any>;
    upsertSellerProfile(userId: string, data: {
        country?: string;
        address?: string;
        companyLogo?: string | null;
        companyName?: string | null;
        descriptions?: string | null;
        profileCompanyUrl?: string | null;
        profileCompanyFileName?: string | null;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        country: string | null;
        address: string | null;
        companyLogo: string | null;
        companyName: string | null;
        descriptions: string | null;
        profileCompanyUrl: string | null;
        profileCompanyFileName: string | null;
    }>;
    listShippingMethods(): Promise<{
        code: string;
        label: string;
    }[]>;
    attachProductImages(productId: string, sellerId: string, payload: {
        cover?: {
            url: string;
            filename: string;
            originalName: string;
            size: number;
            mimeType: string;
        } | null;
        previews?: Array<{
            url: string;
            filename: string;
            originalName: string;
            size: number;
            mimeType: string;
        }>;
    }): Promise<{
        images: {
            id: string;
            createdAt: Date;
            productId: string;
            url: string;
            filename: string;
            originalName: string;
            size: number;
            mimeType: string;
            isCover: boolean;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        price: number | null;
        currency: string | null;
        unit: string;
        weight: number;
        volume: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProductStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        priceType: import(".prisma/client").$Enums.PriceType;
        sellerId: string;
    }>;
    getAdminTradingAnalytics(): Promise<{
        totalProducts: number;
        pendingProducts: number;
        totalOrders: number;
        ordersByStatus: Record<string, number>;
        totalRevenue: any;
    }>;
    getBuyerAnalytics(buyerId: string): Promise<{
        totalOrders: number;
        pendingOrders: number;
        totalSpent: any;
        recentOrders: ({
            product: {
                name: string;
                seller: {
                    email: string;
                    fullname: string;
                };
                images: {
                    id: string;
                    createdAt: Date;
                    productId: string;
                    url: string;
                    filename: string;
                    originalName: string;
                    size: number;
                    mimeType: string;
                    isCover: boolean;
                }[];
            };
            shipment: {
                id: string;
                currency: import(".prisma/client").$Enums.Currency | null;
                createdAt: Date;
                status: import(".prisma/client").$Enums.ShipmentStatus;
                updatedAt: Date;
                orderId: string;
                method: import(".prisma/client").$Enums.ShipmentMethod;
                carrier: string | null;
                trackingNumber: string | null;
                trackingUrl: string | null;
                seaPricingMode: import(".prisma/client").$Enums.SeaPricingMode | null;
                cbmVolume: number | null;
                containerType: import(".prisma/client").$Enums.ContainerType | null;
                freightCost: number | null;
            };
        } & {
            id: string;
            currency: import(".prisma/client").$Enums.Currency;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            productId: string;
            quantity: number;
            notes: string | null;
            pricePerUnit: number;
            totalPrice: number;
            buyerId: string;
        })[];
    }>;
    getSellerAnalytics(sellerId: string): Promise<{
        totalProducts: number;
        totalOrders: number;
        totalRevenue: any;
        pendingShipments: number;
        recentOrders: ({
            product: {
                name: string;
            };
            shipment: {
                id: string;
                currency: import(".prisma/client").$Enums.Currency | null;
                createdAt: Date;
                status: import(".prisma/client").$Enums.ShipmentStatus;
                updatedAt: Date;
                orderId: string;
                method: import(".prisma/client").$Enums.ShipmentMethod;
                carrier: string | null;
                trackingNumber: string | null;
                trackingUrl: string | null;
                seaPricingMode: import(".prisma/client").$Enums.SeaPricingMode | null;
                cbmVolume: number | null;
                containerType: import(".prisma/client").$Enums.ContainerType | null;
                freightCost: number | null;
            };
            buyer: {
                email: string;
                fullname: string;
            };
        } & {
            id: string;
            currency: import(".prisma/client").$Enums.Currency;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            productId: string;
            quantity: number;
            notes: string | null;
            pricePerUnit: number;
            totalPrice: number;
            buyerId: string;
        })[];
        topProducts: {
            id: string;
            name: string;
            sold: number;
            revenue: number;
        }[];
    }>;
}
