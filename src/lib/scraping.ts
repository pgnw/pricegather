import {scrapeColes} from "@/lib/scraping/coles";
import {scrapeAldi} from "@/lib/scraping/aldi";

export async function scrape() {
    await scrapeAldi();
}
