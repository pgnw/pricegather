import {prisma} from "@/lib/prisma";
import assert from "node:assert";
import {populateStore} from "@/lib/data/products";
import ky from "ky";
import {AldiAPIResponse} from "@/lib/scraping/aldi/types";
import {Agent} from "node:http";
import {woolworthsStoreId} from "@/lib/data/staticData";
import {transformWhoolworthsAPIProduct} from "@/lib/scraping/woolworths/transform";
import {Product} from "@/generated/prisma/client";

function getHeaders() {
    const authCookie = '_abck=2DD39986C79E511139EB31F3656E8D8C~-1~YAAQjvI3F2rOPPCgAQAACCBW+hCKbBI73N6xazR3I+vpDBQYBhUbgmGNozwuAHg3oh9nxO+gBD5+WvI2zpxNcpmQtdKyGqNBDnLTN19EvWEQCLfq+T/WNULqlQ+4tAO1uCBsQNy+Qd8pV+ijkpPOONB7suQgFd0zRIF2r/813Gd1U/PYEVC4WCLHW8Uu90zi2HXT3w18AVXghLLdTZqS5x0MI5kRpbpOsJBQ+rFJPu/9jn1W7zwRkacbd0q0AFPwfoJb8O8yLn+yAgQPCxJ7noHM2fl5qPb1fonagc/fNv6bFWKrrgLUPs3R0o8fx9UaeV8Pq5UklHjIWdrG9QzZmw1jscIM/9CauZadI/d6zSPs7HasrB/R+fV8e5xaqwAQxFoBjoT/zkFdCoJ3kEewY3d/wxuN+QAvSgRtPFm+jNq5JXRxY2jf03xkT4UeoXK/3BLwPUqVMdkKUQFCBauCO3GCVPoEtMFcm8p+u/r94Jxmpq49NuRCZnecX0t6I2WA30d8xs6W0R+vrvHLsOuj52jilrgo8EGPn5xShGdVTaujZiC/bFX34TSWTnMxa4gwxTsHpOB9Nxj7fySNHrHmbygXA0bzPQaaenVrWEBHanurs6M0Xq9o1KJZCCKl88rj8EHdJiMLWkOK4Au0WEF/AJDrpzunx5jr0zBV4IHhFXreMtsCSImiTQkquqEVClVLwycKahuwBZo9UXEWIBbDoH5U5nhZ10lkW8tcPWXe0TJToBL3BeiXhXxKyScsdJkP5KzviRXqYxKmC7UCWSjLmt8kT8Gdu9vK47k+4nq+pZtSkPSlwa9djsHFnJgpJHB7tl8aCFbqAcZlhtE2vC0G7XkmVllqNlNa+7kpKhVXO8s/yjEFHdPC5LWk2u6wGnNcoMu7H72+P1CrkLtx0L0NtUoLIgKHBzqdQAbLyJ+gGBDh74LPHGP7+87LeHgbeXi8M3Zn1RnHCdB/1piuQicOaGwSP/DxYgsFDzND2TzvOI2v7d0wLkE79lpAIGE=~-1~-1~1790909795~AAQAAAAG%2f%2f%2f%2f%2fxJ4F6ZPiO+Y+np5gW41a8S7U2TZ7zr17NnxTk%2f7t87BO0YgMvVDFZn9oQJXCE3h5h7GElF2vfjRUR0D%2fpxb329qGqDX0OGxBPMUvIcbeuv4ZNh8gA93JIy0Rq8+V9+o3zgSEg66%2fbl3ZtGwHAGMcUaZFAojKfUX+PAqC2YV26a4dh9WWhi4ks6O7rVaWGHonlIRJoxadKjb~-1; bm_s=YAAQjvI3F3POPPCgAQAAHCFW+gaB7WqGT4g+QJEH9aHwk0ijLvyxIjrCPkCd4gsKLASJW4Yz5ZeKjurbLje9QbvnfLen5w1x6lUUrgZC+Ops+TLR1tVe2Fn7PlAOddwyFOyn1VBGNon0Y7zGHMXviX/IdcZH4Lu5slV+ck88NPZ8+vAOeCnL44iUzOf+4FjU9wNi2cjJjOQfDu0hMOmnNNGIixBx1LQF4LLNsO+TFLUTg3tkVEZg6pIzjuedHbod/q7wExJTKRWKQOsV8e8+rBm9ilslYWqPbmXfL4i7vAr6+mZrfAzumNxH9XhJRtkD6DmxBAGfEDFGM4eiKDxmk4wtyz12sCd34cbeIFxzYdEk1TVTT3FS3ZfZ4mUBjB615t8gozGewCynVSetKoFBrRgyt08CaJ34DYZ9qZKph7a+bYZCRTnThAzY9VivLOZceuWBu3N+rgUJqrRue8ZMN2VKh4ev40Gxe0rZc4Gnpa+v5nr5bBCSj2kdPUxVQeg6tCRUhrupID3insqAjYqZei3Fxfzow3j5MUrT0ZOnScgxrMm/wEogCzyUN3zwmapfOLP1GoO0OBS2vJNBAc5PhpgMCwGC/05tXohUW+zCJvI1dycoiH667IvMDGHA0XLzA9k1Dhfr4lSoE5wO3mwBu40wyZxY4ydy9kGlb4TY3BFQrDnGkZhYsc6rH+QTALlzKLtmU/nPIPwqBB3hRmt6lK4jLB6qnC70nqJVrQlGNLkdpM1GjFiOshQvp9N1QX7qtM9x7dTVN5Utew513Jwfe150K8EZq3L1UHMChRUYRyzqrvOx+tJt+ZM85WXKxld2NQW7DWix0jyMCooEXF2Uwy/STnG+hb8FTYP1BEmeFeWqi/a8ndUI/gV12K5F3JQvj7dCP29TruURFLY4QPYi0iNvy2FHcG/WUogoc0F6ahRc/tj1HKwcrZHGOwbFzhQLcq6GtCtvf+pG/TC9UkM/H2GN6/+XbZZLDvWGsEnguu1H+VJxfw01FD6K016HNH8K46XzJjztLaXd/u/HOoW1xZbw7WBKPTH4MgKnuRliKw0zeXdHip/GBrYrMvSXoVG5FuTt5zs=; ai_user=WxJMmiQ8Z4N3p6bwczHlNe|2026-07-25T11:11:03.900Z; AMCV_4353388057AC8D357F000101%40AdobeOrg=179643557%7CMCIDTS%7C20728%7CMCMID%7C44936810219218373945357392563494826213%7CMCOPTOUT-1790913541s%7CNONE%7CvVersion%7C5.5.0; bm_lso=F4F937F869E0229DF80934AB87630E52B52DAD55E7E93259407BA5B1922A6C84~YAAQjvI3F87NPPCgAQAAYhJW+glx7cgCUJHCU7BoCC8ndJVxAot+i0MRV4FGbBl9IkO8EVO5moYBB68Y6lHfZTHLFgP+WpRaIvIimB2xCfVd5hsPA71zZ9kTI5ZRuYbzRMQhNX3vmjFIiPxbZvoxFmb8SI1V8fJa3DjMnGsnjyZ9EZa5ide62zi8Z5Y4FEbx2s2wBj9w5xYUCFeOh2J5uOTwk5b+p1wbtW/eRnV7B2PZMXim4wnHIIzIBNWFD935DJ6mEe+aJhVuENGBi/8iXlbTIiFO1Cz3UFu2/JhVkw/H+5MfbWG/iisczcsLidLIMKqsmvj21L1IxN2aTYbkTs8YFkfvlFVS4nJOAgUYXAtQnvtec0/jnTLl/NExOC98I4Kgrn04AOecypId8q4Cnx3HTB/NyNjePBhnEb+F/ZW5klLVzd4XLnyFB0s9I3G0HWqT4UoB6oUTM4DrrcOY4kqTHIrjyMrD1VxAgIZqychubZBI~5~1790906338860; bm_so=F4F937F869E0229DF80934AB87630E52B52DAD55E7E93259407BA5B1922A6C84~YAAQjvI3F87NPPCgAQAAYhJW+glx7cgCUJHCU7BoCC8ndJVxAot+i0MRV4FGbBl9IkO8EVO5moYBB68Y6lHfZTHLFgP+WpRaIvIimB2xCfVd5hsPA71zZ9kTI5ZRuYbzRMQhNX3vmjFIiPxbZvoxFmb8SI1V8fJa3DjMnGsnjyZ9EZa5ide62zi8Z5Y4FEbx2s2wBj9w5xYUCFeOh2J5uOTwk5b+p1wbtW/eRnV7B2PZMXim4wnHIIzIBNWFD935DJ6mEe+aJhVuENGBi/8iXlbTIiFO1Cz3UFu2/JhVkw/H+5MfbWG/iisczcsLidLIMKqsmvj21L1IxN2aTYbkTs8YFkfvlFVS4nJOAgUYXAtQnvtec0/jnTLl/NExOC98I4Kgrn04AOecypId8q4Cnx3HTB/NyNjePBhnEb+F/ZW5klLVzd4XLnyFB0s9I3G0HWqT4UoB6oUTM4DrrcOY4kqTHIrjyMrD1VxAgIZqychubZBI~5; bff_region=syd2; at_check=true; AMCVS_4353388057AC8D357F000101%40AdobeOrg=1; INGRESSCOOKIE=1784977865.181.63.630969|37206e05370eb151ee9f1b6a1c80a538; dtCookie=v_4_srv_4_sn_4CB80F98CA8BD7093AE1AF7D592BCFAB_perc_100000_ol_0_mul_1_app-3Af908d76079915f06_1_rcs-3Acss_0; akaalb_woolworths.com.au=~op=www_woolworths_com_au_ZoneB:PROD-ZoneB|www_woolworths_com_au_ZoneA:PROD-ZoneA|www_woolworths_com_au_BFF_SYD_Launch:WOW-BFF-SYD2|~rv=19~m=PROD-ZoneB:0|PROD-ZoneA:0|WOW-BFF-SYD2:1|~os=43eb3391333cc20efbd7f812851447e6~id=4578d57cbfe54f3eb3d85628adf78fdb; w-rctx=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3OTA5MDU2NTIsImV4cCI6MTc5MDkwOTI1MiwiaWF0IjoxNzkwOTA1NjUyLCJpc3MiOiJXb29sd29ydGhzIiwiYXVkIjoid3d3Lndvb2x3b3J0aHMuY29tLmF1Iiwic2lkIjoiMCIsInVpZCI6ImUwNTY0MDVmLTczN2UtNDI5Zi05ZTM5LWUyY2Y5ODgxNDg0NCIsIm1haWQiOiIwIiwiYXV0IjoiU2hvcHBlciIsImF1YiI6IjAiLCJhdWJhIjoiMCIsIm1mYSI6IjEifQ.nhiFdusdBYcS6OY8SEp8jvNoDXuRw9LyyeweGmwRRh4dlSFXpggb6fM4SmUAqwo_XqWW0MHhvCIl06bMMvDu7XaZTtXKRMLMvy-LY7zKmk_irZSpaYySk5INQGoHm6yJsynT4rqolgZ9jh4erzZinHtlTFJx0bivx0qwdBmdMtIEwNp207iTH5dWIkdUNKTwy_tkmo4M4c3vv0qW0J4a6FqeEEqFl6tBD1XD8Z7sWS0Lem-wbgjir5YHy1N_5orQm2UHiubY_nhcZZrX1mdA4OfjGiBuqRdOfMtclKlZCmnMnlA8JdsHZBRl6gx77pkbgzOyNhyelPhg5Uu-A0tgZQ; wow-auth-token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3OTA5MDU2NTIsImV4cCI6MTc5MDkwOTI1MiwiaWF0IjoxNzkwOTA1NjUyLCJpc3MiOiJXb29sd29ydGhzIiwiYXVkIjoid3d3Lndvb2x3b3J0aHMuY29tLmF1Iiwic2lkIjoiMCIsInVpZCI6ImUwNTY0MDVmLTczN2UtNDI5Zi05ZTM5LWUyY2Y5ODgxNDg0NCIsIm1haWQiOiIwIiwiYXV0IjoiU2hvcHBlciIsImF1YiI6IjAiLCJhdWJhIjoiMCIsIm1mYSI6IjEifQ.nhiFdusdBYcS6OY8SEp8jvNoDXuRw9LyyeweGmwRRh4dlSFXpggb6fM4SmUAqwo_XqWW0MHhvCIl06bMMvDu7XaZTtXKRMLMvy-LY7zKmk_irZSpaYySk5INQGoHm6yJsynT4rqolgZ9jh4erzZinHtlTFJx0bivx0qwdBmdMtIEwNp207iTH5dWIkdUNKTwy_tkmo4M4c3vv0qW0J4a6FqeEEqFl6tBD1XD8Z7sWS0Lem-wbgjir5YHy1N_5orQm2UHiubY_nhcZZrX1mdA4OfjGiBuqRdOfMtclKlZCmnMnlA8JdsHZBRl6gx77pkbgzOyNhyelPhg5Uu-A0tgZQ; prodwow-auth-token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3OTA5MDU2NTIsImV4cCI6MTc5MDkwOTI1MiwiaWF0IjoxNzkwOTA1NjUyLCJpc3MiOiJXb29sd29ydGhzIiwiYXVkIjoid3d3Lndvb2x3b3J0aHMuY29tLmF1Iiwic2lkIjoiMCIsInVpZCI6ImUwNTY0MDVmLTczN2UtNDI5Zi05ZTM5LWUyY2Y5ODgxNDg0NCIsIm1haWQiOiIwIiwiYXV0IjoiU2hvcHBlciIsImF1YiI6IjAiLCJhdWJhIjoiMCIsIm1mYSI6IjEifQ.nhiFdusdBYcS6OY8SEp8jvNoDXuRw9LyyeweGmwRRh4dlSFXpggb6fM4SmUAqwo_XqWW0MHhvCIl06bMMvDu7XaZTtXKRMLMvy-LY7zKmk_irZSpaYySk5INQGoHm6yJsynT4rqolgZ9jh4erzZinHtlTFJx0bivx0qwdBmdMtIEwNp207iTH5dWIkdUNKTwy_tkmo4M4c3vv0qW0J4a6FqeEEqFl6tBD1XD8Z7sWS0Lem-wbgjir5YHy1N_5orQm2UHiubY_nhcZZrX1mdA4OfjGiBuqRdOfMtclKlZCmnMnlA8JdsHZBRl6gx77pkbgzOyNhyelPhg5Uu-A0tgZQ; bm_sz=D6FB5C2DDE845F2FF2D4F98A63160569~YAAQjvI3F2LOPPCgAQAAsB5W+gFgb5eQE+pcN/zcNKtBpznln04AE9YbgVynv/pFKwyPzEy7tO86adZrfMRzHJjmbte8CLkSx6uPoX77owQyYzvDuZyuTorLIw1kJ2AMyfq31AymkYnpud0vK8YOVKTl+hO8Mj7863A9Oz0FK4XOuYbaGqycr5AJbogM5VstGKzKV0Mk4y+Dk3MpFBz00Ln4XsWM6l+OZ2fEXr9LRhIHv+URFuvEe4XjBFb3OxRU9rKdBYyeyb0Y33YI5F5zJuKsED7TsITXU76qK52uTP86BRLNujGVdfg1YSs84OqQe9XecR3t7RhteXEU23UTQKdHFuZo+3WXwCBApb/AhLI7sLjpIUq1+iY1DyRsG3MVQ23f0rXVEtPyywco+JqQVaC5Mc9UIO+2k21h3wEQJF9lMgisry2vU6YIi6Tzwt+Qxi7POZ2ttXXY~4469814~4538692; ai_session=mp1GBQNsxZlZPxltxAtX9S|1790905650448|1790906341426; ak_bmsc=F0BA7EF3FCD875BB35CD1F08483B860B~000000000000000000000000000000~YAAQjvI3F2K/PPCgAQAACYpU+gG2MF4/NqhviJGDqKvlPJtn8Cr8V25KWpfzBGVSe6u/3zhvmQlBNosiSS8GRye5C1dnUAySzFb9EjRHXqcfJy59VHRQdAYUMigeed05+ntKr+rPH9SzHavJvhUxKt18lfwe5zd5VIUYx5raJaBunkWDTG/9R/SaSivwWKHnKzIDkU+RtD6GdAI2m2NE+UslRdK3zqYTElvXhCXu6WBS2ZlmcBjaO5bWNXSiKW6hf6n5T55D1JJ8FIfyua6+geZdCyCwdIImHK97ZnG10lUIspnUZsmYdrJvf7GcH9gRL0g9w8k6nUreF0QANpObYY0T1CCXRf9HZEj4MCg+5yJ0dKOPWJEs7nG1jqnTXN+n4hBEHy13hpE5q6E=; AKA_A2=A; bm_mi=8BA46BC26B20FD7CD0EC5514B4A76D93~YAAQjvI3F8zNPPCgAQAAYhJW+gFvrLOgb1NpK991nhdHdCLzIJZ8TXIqHj7K7yyI84D13lDT7RBuWdMvDEwio2MXstCc4c61pSr4VeFuJT37zYCx8+EeNrGNgXEjOjqgG0vikrY3vdR815OTLq9mAAfJxoAn0x980MFem+w9wHxdsMHjf5YVqaVJkck9j4qNOmXmVA2c/Clba0gPA9ibvim0nfYaoMXY6fMM0RGGywP0yb7pVvcdPVxDAMIURO2PWaQDOEFZnBnbaE28h+l6spmqkeo4eZkSQsDETFf8uhDuVzavV1v8EfuGdUJoB74l4hzeCbfcdtjIvqFG22rh5SJFlQIf2XLU8A==~1; bm_sv=7BB322A577CFF8D70A854EC4E172A1A7~YAAQjvI3F3LOPPCgAQAAGyFW+gE2ZbFOYyH2GUHS3IP1PP6rldrA30Zny//mF10RySCOO3SaJBabdbzb1nNp5RrMlB6cK41X8O6/3TmBUtKvV15ap1RKMxBKuax25tCJDZAhIsOsoyiUWcAwZv8MEI9AgHIKhULinVh7QsMO+TMm41/FvZDgGAnKcKzW1PrNsLn2DKevZvS1S0DghU+9SHSiNTEcJsDq0WZxblhhfily+ULUXJg2uRZjv4ZisFy0p6GHGh7uHGQ=~1; mbox=session#37d9c21ab22044a3a8301422bd004e4b#1790908202'
    const UserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:157.0) Gecko/20100101 Firefox/157.0';

    return {
        Cookie: authCookie,
        'User-Agent': UserAgent,
    }
}

export async function scrapeWoolworths() {
    const categories = await getCategories();

    // Woolworths categories have some duplicate products
    const totalProducts = new Map<string, Product>();

    const millisecondsBetweenRequests = 1000;
    const miniumWaitTime = () => new Promise(resolve => setTimeout(resolve, millisecondsBetweenRequests));

    for (const category of categories) {
        const delay = miniumWaitTime();
        const productsResponse = await getProductsFromCategory(category);

        if (productsResponse.Bundles == null)
            continue;

        for (const bundle of productsResponse.Bundles) {
            for (const apiProduct of bundle.Products) {

                const product = transformWhoolworthsAPIProduct(apiProduct);
                totalProducts.set(product.id, product);
            }
        }
        // Only send requests once every x milliseconds to avoid getting banned.
        await delay;
    }

    await populateStore(woolworthsStoreId, totalProducts.values().toArray());
}

type ApiCategories = {
    Categories: [
        Category,
    ]
}

type Category = {
    NodeId: string,
    UrlFriendlyName: string,
    Description: string,
    IsRestricted: boolean,
}

type ApiProductsFromCategory = {
    Bundles: [ApiBundle],
}

type ApiBundle = {
    Products: [WhoolworthsApiProduct]
}

export type WhoolworthsApiProduct = {
    Stockcode: number,
    Price: number,
    Name: string,
    UrlFriendlyName: string,
    PackageSize: string,
    Vendor: string
};

async function getCategories(): Promise<Category[]> {
    const apiURL = 'https://www.woolworths.com.au/apis/ui/PiesCategoriesWithSpecials';

    const fetchObj = {
        headers: getHeaders(),
    }
    let categories = await ky.get<ApiCategories>(apiURL, fetchObj).json();

    // Only return non restricted categories, also ignore third party sellers
    return  categories.Categories.filter(c => !c.IsRestricted && c.Description != 'Everyday Market');
}

async function getProductsFromCategory(category: Category) {
    const formatObject = `{\"name\":\"${category.Description}\"}`;
    const body = {
        categoryId: category.NodeId,
        pageNumber: 1,
        pageSize: 36,
        url: 'a', // Seems to accept anything?
        formatObject: formatObject,
    };
    const url = 'https://www.woolworths.com.au/apis/ui/browse/category';
    const products = ky.post<ApiProductsFromCategory>(url, {headers: getHeaders(), json: body}).json();

    return products;
}