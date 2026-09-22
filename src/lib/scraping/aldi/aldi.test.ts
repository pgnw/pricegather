import {expect, test, vi} from "vitest";
import {scrapeAldi} from "@/lib/scraping/aldi/aldi";
import {prisma} from "@/lib/__mocks__/prisma";

import {transformAldiAPIProduct} from "@/lib/scraping/aldi/transform";
import {populateStore} from "@/lib/data/products";
import {mockAldiResponse} from "@/lib/__mocks__/handler";

vi.mock("@/lib/prisma");
vi.mock("@/lib/data/products");

test('Pulls from Aldi products endpoint', async () => {

    const aldiStoreId = 2;
    prisma.store.findUnique.mockResolvedValueOnce({
        id: aldiStoreId,
        name: "Aldi",
    });

    const mockProducts = mockAldiResponse.data.map(p => {
        return transformAldiAPIProduct(p, aldiStoreId);
    });

    await scrapeAldi();
    expect(populateStore).toHaveBeenCalledOnce();

    expect(populateStore).toHaveBeenCalledWith(aldiStoreId, mockProducts);
})