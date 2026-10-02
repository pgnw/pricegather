import {http, HttpResponse} from 'msw'
import {AldiAPIProduct, AldiAPIResponse} from "@/lib/scraping/aldi/types";

export const handlers = [
    http.get('https://api.aldi.com.au/v3/product-search', ({request}) => {
        const url = new URL(request.url);
        const offset = Number(url.searchParams.get('offset'));


        const products = mockAldiResponse.data.slice(offset)
        const response = mockAldiResponse;
        response.data = products;

        return HttpResponse.json(response)
    }),
]

export const mockAldiResponse = {
    meta:
        {
            "pagination": {
                "offset": 0,
                "limit": 12,
                "totalCount": 2
            },
        },
    data:
        [
            {
                "sku": "000000000000173130",
                "name": "Mega Roulette 45g",
                "sellingSize": "45 g",
                "price": {
                    "amountRelevant": 99,
                    "comparison": 99
                },
            },
            {
                "sku": "000000000000199822",
                "name": "Organic Extra Virgin Olive Oil 500ml",
                "sellingSize": "500 ml",
                "price": {
                    "amountRelevant": 799,
                    "comparison": 799
                }
            }
        ]
} as AldiAPIResponse
