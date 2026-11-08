import { NextRequest, NextResponse } from "next/server";
import { trackUserActivity } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, category, label, value, userId, sessionId } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    await trackUserActivity({
      action,
      category,
      label,
      value,
      userId,
      sessionId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking activity:", error);
    return NextResponse.json(
      { error: "Failed to track activity" },
      { status: 500 }
    );
  }
}
