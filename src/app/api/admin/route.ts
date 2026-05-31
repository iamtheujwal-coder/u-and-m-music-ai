import { NextResponse } from "next/server";

// GET /api/admin — Admin dashboard stats
export async function GET() {
  // In production: verify admin role from auth
  const stats = {
    total_users: 1247,
    total_projects: 5893,
    processing_jobs: 342,
    failed_jobs: 12,
    revenue_mtd: 89400,
    support_tickets: 28,
    voice_models: 156,
    active_subscriptions: {
      free: 892,
      creator: 234,
      pro_artist: 98,
      studio: 23,
    },
  };

  return NextResponse.json({ stats });
}
