import { NextRequest, NextResponse } from "next/server";
import { getPageViewsOverTime } from "@/lib/analytics";
import { getAdminUser } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "30");

    const data = await getPageViewsOverTime(days);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching page views:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
