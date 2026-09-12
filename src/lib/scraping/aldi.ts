export async function scrapeAldi() {

    let res = await getAldiProducts(0);
    let jsonData = await res.json();

    let amountProductsReturned = jsonData['data'].length;
    let offset = amountProductsReturned;

    let products = jsonData['data'];
    // upsert

    while (amountProductsReturned > 0) {
        res = await getAldiProducts(offset);
        jsonData = await res.json();

        amountProductsReturned = jsonData['data'].length;
        offset += amountProductsReturned;

        products = jsonData['data'];
        //upsert
    }
}

async function getAldiProducts(offset: number): Promise<Response> {
    const apiURL = 'https://api.aldi.com.au/v3/product-search';
    const currency = 'AUD';
    const serviceType = 'walk-in';
    const limit = 60;
    const servicePoint = 'G452';

    const fullURL = `${apiURL}?currency=${currency}&serviceType=${serviceType}&limit=${limit}&offset=${offset}&servicePoint=${servicePoint}`;

    const fetchObj = {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:155.0) Gecko/20100101 Firefox/155.0',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
        }
    }

    return fetch(fullURL, fetchObj);
}