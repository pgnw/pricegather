import {scrapeColes} from "@/lib/scraping/coles/coles";
import {scrapeAldi} from "@/lib/scraping/aldi/aldi";
import {scrapeWoolworths} from "@/lib/scraping/woolworths/woolworths";

export async function scrape() {
    const scrapeTasks = [];
    scrapeTasks.push(scrapeColes());
    //scrapeTasks.push(scrapeWoolworths());
    //scrapeTasks.push(scrapeAldi());

    await Promise.all(scrapeTasks);
}
