'use server';
import {getProducts, getProductsCached} from "@/lib/actions";


export default async function ProductsTable(search: { name: string; }) {
    const products = await getProducts(search)
    return (
        <>
            {products.map((product) => (
                <div key={product.id} className={'flex flex-col border border-gray-400 rounded-md mt-2  '}>
                    <div className={'block'}>
                        <label>Name: {product.name}</label>
                    </div>
                    <div className={'block'}>
                        <label>Description: {product.description}</label>
                    </div>
                    <div className={'block'}>
                        <label>Cost: {product.price.toString()}</label>
                    </div>
                    <div className={'block'}>
                        <label>Grams: {product.grams}</label>
                    </div>
                </div>
            ))}
        </>);
}
