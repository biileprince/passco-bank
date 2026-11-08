import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/phone";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: unknown; password?: unknown };
    const phone = typeof body.phone === "string" ? normalizePhone(body.phone) : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!phone || !password) {
      return Response.json({ error: "Invalid phone number or password." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { phone },
      select: { email: true },
    });

    if (!user) {
      return Response.json({ error: "Invalid phone number or password." }, { status: 401 });
    }

    const authRequest = new Request(new URL("/api/auth/sign-in/email", request.url), {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify({ email: user.email, password }),
    });

    return auth.handler(authRequest);
  } catch (error) {
    console.error("Phone sign-in failed:", error);
    return Response.json({ error: "Unable to sign in. Please try again." }, { status: 500 });
  }
}
