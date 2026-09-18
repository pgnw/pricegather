'use client';
import {Product} from "@/generated/prisma/client";
import {use, useRef} from "react";
import {OramaProduct} from "@/lib/Orama";
import {useVirtualizer, useWindowVirtualizer} from '@tanstack/react-virtual';

export default function ProductsTable({productsPromise}: {
    productsPromise: Promise<OramaProduct[]> | OramaProduct[]
}) {
    let products: OramaProduct[] = [];
    if (productsPromise instanceof Promise)
        products = use(productsPromise);
    else
        products = productsPromise;

    const rowVirtualizer = useWindowVirtualizer({
        count: products.length,
        estimateSize: () => 120,
        measureElement: (element) => element.getBoundingClientRect().height,
        gap: 8,
        overscan: 15
    });

    return (
        <div style={{height: `${rowVirtualizer.getTotalSize() + 40}px`}} className={'w-full relative mt-2'}>
            {rowVirtualizer.getVirtualItems().map((v) => {
                const product = products[v.index];
                return (
                    <div key={product.productId}
                         className={'flex flex-col border border-gray-400 rounded-md absolute top-0 left-0 w-full'}
                         style={{transform: `translateY(${v.start}px)`}}
                         ref={rowVirtualizer.measureElement}
                         data-index={v.index}>
                        <div className={'block'}>
                            <label>Name: {product.name}</label>
                        </div>
                        <div className={'block'}>
                            <label>Description: {product.description}</label>
                        </div>
                        <div className={'block'}>
                            <label>Cost: ${product.price.toString()}</label>
                        </div>
                        <div className={'block'}>
                            <label>Grams: {product.grams}</label>
                        </div>
                    </div>
                )
            })}

            {/*{products.map((product) => (*/}
            {/*    <div key={product.productId} className={'flex flex-col border border-gray-400 rounded-md mt-2  '}>*/}
            {/*        <div className={'block'}>*/}
            {/*            <label>Name: {product.name}</label>*/}
            {/*        </div>*/}
            {/*        <div className={'block'}>*/}
            {/*            <label>Description: {product.description}</label>*/}
            {/*        </div>*/}
            {/*        <div className={'block'}>*/}
            {/*            <label>Cost: ${product.price.toString()}</label>*/}
            {/*        </div>*/}
            {/*        <div className={'block'}>*/}
            {/*            <label>Grams: {product.grams}</label>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*))}*/}

        </div>);
}
