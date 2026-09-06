import { NextResponse } from 'next/server';

export async function GET() {
    // const authHeader = req.headers.get('Authorization');
    // const cronSecret = process.env.CRON_SECRET;
    //
    // if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    //     return res.status(401).end('Unauthorized');
    // }


    return NextResponse.json({ ok: true });
}