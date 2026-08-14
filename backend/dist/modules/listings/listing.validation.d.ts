import { z } from 'zod';
export declare const createListingSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        price: z.ZodNumber;
        address: z.ZodString;
        city: z.ZodString;
        latitude: z.ZodOptional<z.ZodNumber>;
        longitude: z.ZodOptional<z.ZodNumber>;
        bedrooms: z.ZodOptional<z.ZodNumber>;
        bathrooms: z.ZodOptional<z.ZodNumber>;
        area: z.ZodOptional<z.ZodNumber>;
        amenities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        houseType: z.ZodEnum<["APARTMENT", "VILLA", "CONDO", "STUDIO", "HOUSE"]>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        price: number;
        address: string;
        city: string;
        houseType: "APARTMENT" | "VILLA" | "CONDO" | "STUDIO" | "HOUSE";
        latitude?: number | undefined;
        longitude?: number | undefined;
        bedrooms?: number | undefined;
        bathrooms?: number | undefined;
        area?: number | undefined;
        amenities?: string[] | undefined;
    }, {
        title: string;
        description: string;
        price: number;
        address: string;
        city: string;
        houseType: "APARTMENT" | "VILLA" | "CONDO" | "STUDIO" | "HOUSE";
        latitude?: number | undefined;
        longitude?: number | undefined;
        bedrooms?: number | undefined;
        bathrooms?: number | undefined;
        area?: number | undefined;
        amenities?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        title: string;
        description: string;
        price: number;
        address: string;
        city: string;
        houseType: "APARTMENT" | "VILLA" | "CONDO" | "STUDIO" | "HOUSE";
        latitude?: number | undefined;
        longitude?: number | undefined;
        bedrooms?: number | undefined;
        bathrooms?: number | undefined;
        area?: number | undefined;
        amenities?: string[] | undefined;
    };
}, {
    body: {
        title: string;
        description: string;
        price: number;
        address: string;
        city: string;
        houseType: "APARTMENT" | "VILLA" | "CONDO" | "STUDIO" | "HOUSE";
        latitude?: number | undefined;
        longitude?: number | undefined;
        bedrooms?: number | undefined;
        bathrooms?: number | undefined;
        area?: number | undefined;
        amenities?: string[] | undefined;
    };
}>;
export type CreateListingInput = z.infer<typeof createListingSchema>['body'];
//# sourceMappingURL=listing.validation.d.ts.map