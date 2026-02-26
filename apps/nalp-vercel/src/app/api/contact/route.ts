import { NextRequest, NextResponse } from "next/server";

// TODO: Connect to database (Postgres, MySQL, etc.) when backend is ready.
// For now, store in memory. In production with serverless, this will not persist.
const contacts: Array<{
  name: string;
  email: string;
  message: string;
  requestNda: boolean;
  requestType: string;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, requestNda, requestType } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    contacts.push({
      name: String(name),
      email: String(email),
      message: String(message),
      requestNda: Boolean(requestNda),
      requestType: String(requestType || "info"),
    });

    // Log for debugging during development
    console.log("[Contact] New submission:", { name, email, requestType, requestNda });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 }
    );
  }
}
