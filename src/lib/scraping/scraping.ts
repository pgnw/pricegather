import {scrapeColes} from "@/lib/scraping/coles/coles";
import {scrapeAldi} from "@/lib/scraping/aldi/aldi";
import {scrapeWoolworths} from "@/lib/scraping/woolworths/woolworths";

export async function scrape() {
    await scrapeWoolworths();
    await scrapeAldi();
}
