import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");

    const activities = await prisma.userActivity.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        action: true,
        category: true,
        label: true,
        os: true,
        browser: true,
        createdAt: true,
      },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
