import { TradingService } from './trading.service';
import { OrderStatus, ShipmentMethod, ShipmentStatus } from '@prisma/client';
export declare class TradingController {
    private readonly tradingService;
    constructor(tradingService: TradingService);
    createProduct(req: any, data: {
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
    getApprovedProducts(sellerId?: string): Promise<({
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
    updateProduct(req: any, id: string, data: Partial<{
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
    getSellerProducts(req: any): Promise<{
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
    getAllProductsAdmin(): Promise<({
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
    attachProductImages(req: any, id: string, body: {
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
    approveProduct(req: any, id: string): Promise<{
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
    rejectProduct(req: any, id: string, reason?: string): Promise<{
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
    createOrder(req: any, data: {
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
    getOrders(req: any, status?: OrderStatus): Promise<({
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
    setOrderFixedPrices(id: string, body: {
        items: Array<{
            fixedUnitPrice: number;
            currency: 'IDR' | 'USD';
        }>;
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
    updateShipment(id: string, body: {
        method?: ShipmentMethod;
        carrier?: string | null;
        trackingNumber?: string | null;
        trackingUrl?: string | null;
        status?: ShipmentStatus;
        seaPricingMode?: 'CBM' | 'CONTAINER' | null;
        cbmVolume?: number | null;
        containerType?: 'FT20' | 'FT40' | null;
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
    getSellerProfile(req: any): Promise<any>;
    upsertSellerProfile(req: any, data: {
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
    getSellerProfileById(userId: string): Promise<any>;
    listShippingMethods(): Promise<{
        code: string;
        label: string;
    }[]>;
    adminAnalytics(): Promise<{
        totalProducts: number;
        pendingProducts: number;
        totalOrders: number;
        ordersByStatus: Record<string, number>;
        totalRevenue: any;
    }>;
    buyerAnalytics(req: any): Promise<{
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
    sellerAnalytics(req: any): Promise<{
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
