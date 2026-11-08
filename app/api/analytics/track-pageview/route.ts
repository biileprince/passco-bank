import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      path,
      referrer,
      ipAddress,
      userAgent,
      os,
      browser,
      device,
      sessionId,
      isNewSession,
    } = body;

    // Handle session tracking (no more PageView model)
    if (isNewSession) {
      // Create new analytics session
      await prisma.analyticsSession.create({
        data: {
          sessionId,
          landingPage: path,
          referrer,
          ipAddress,
          userAgent,
          os,
          browser,
          device,
          pageCount: 1,
        },
      });
    } else {
      // Update existing session page count and track last visited page
      await prisma.analyticsSession
        .update({
          where: { sessionId },
          data: { 
            pageCount: { increment: 1 },
            endedAt: new Date(),
          },
        })
        .catch(() => {
          // Session might not exist yet, create it
          return prisma.analyticsSession.create({
            data: {
              sessionId,
              landingPage: path,
              referrer,
              ipAddress,
              userAgent,
              os,
              browser,
              device,
              pageCount: 1,
            },
          });
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking session:", error);
    return NextResponse.json(
      { error: "Failed to track session" },
      { status: 500 }
    );
  }
}
