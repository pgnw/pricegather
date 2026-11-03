export type ColesCategoryResponse = {
    menuItems: ColesMenuItems;
};

export type ColesMenuItems = {
    restrictedIds: string[];
    items: ColesCategory[];
};

export type ColesCategory = {
    id: string;
    level: number;
    name: string;
    originalName: string;
    productCount: number;
    seoToken: string;
    type: string;
    subType: string;
    childItems?: ColesCategory[];
};


export type ColesProductResponse = {
    pageProps: {
        searchResults: ColesSearchResults;
    };
};

export type ColesSearchResults = {
    noOfResults: number;
    start: number;
    pageSize: number;
    results: ColesProduct[];
};

export type ColesProduct = {
    _type: "PRODUCT";
    id: number;

    name: string;
    brand: string | null;
    description: string;
    size: string | null;

    pricing: ColesPricing | null;
};

export type ColesPricing = {
    now: number;

    unit: {
        quantity: number;
        isWeighted?: boolean;
        ofMeasureUnits?: string;
    };

    comparable?: string | null;
};