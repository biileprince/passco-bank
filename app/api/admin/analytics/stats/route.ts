import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsStats } from "@/lib/analytics";
import { getAdminUser } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const timeRange = (searchParams.get("timeRange") || "all") as
      | "today"
      | "week"
      | "month"
      | "all";

    const stats = await getAnalyticsStats(timeRange);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching analytics stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
