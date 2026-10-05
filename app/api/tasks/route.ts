import { NextResponse } from 'next/server';
import { fetchZohoTasks } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchZohoTasks();
    return NextResponse.json({
      success: true,
      data: data.tasks,
      totalCount: data.tasks.length,
      lastFetchedAt: data.lastFetchedAt,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error fetching sheet data';
    console.error('Error fetching Zoho tasks:', error);
    return NextResponse.json(
      {
        success: false,
        error: message,
        data: [],
      },
      { status: 500 }
    );
  }
}
