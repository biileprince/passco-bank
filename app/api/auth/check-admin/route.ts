import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ isAdmin: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    return NextResponse.json({ isAdmin: user?.role === "admin" });
  } catch (error) {
    console.error("Check admin error:", error);
    return NextResponse.json({ isAdmin: false });
  }
}
