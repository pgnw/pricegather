import { NextResponse } from 'next/server';
import {scrape} from "@/lib/scraping";

export async function GET() {
    // const authHeader = req.headers.get('Authorization');
    // const cronSecret = process.env.CRON_SECRET;
    //
    // if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    //     return res.status(401).end('Unauthorized');
    // }
    await scrape();

    return NextResponse.json({ ok: true });
}