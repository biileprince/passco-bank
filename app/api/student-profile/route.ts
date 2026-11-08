import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizePhone } from "@/lib/phone";

const profileSchema = z.object({
  studentId: z.string().trim().min(5).max(30),
  phone: z.string().trim().min(7).max(30),
  program: z.string().trim().min(2).max(150),
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ message: "You must be signed in." }, { status: 401 });
  }

  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Please provide valid student details." }, { status: 400 });
  }

  const studentId = parsed.data.studentId.toUpperCase();
  const phone = normalizePhone(parsed.data.phone);
  const existing = await prisma.user.findFirst({
    where: { studentId, NOT: { id: session.user.id } },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ message: "That Student ID is already registered." }, { status: 409 });
  }

  const existingPhone = await prisma.user.findFirst({
    where: { phone, NOT: { id: session.user.id } },
    select: { id: true },
  });
  if (existingPhone) {
    return NextResponse.json({ message: "That phone number is already registered." }, { status: 409 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      studentId,
      phone,
      program: parsed.data.program,
      level: null,
    },
  });

  return NextResponse.json({ success: true });
}
