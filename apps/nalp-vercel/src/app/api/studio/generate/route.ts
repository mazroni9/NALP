import { NextRequest, NextResponse } from "next/server";

// TODO: Connect to real 3D generator backend (e.g., Python/FastAPI service) when ready.
// For now, return mock run with fake GLB/PNG URLs.

let runIdCounter = 1;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { land, zone_a_percent, zone_b_percent, zone_c_percent, street } = body;

    const id = `run-${runIdCounter++}`;

    const run = {
      id,
      status: "completed",
      input: {
        land: land ?? {},
        zone_a_percent: zone_a_percent ?? 50,
        zone_b_percent: zone_b_percent ?? 30,
        zone_c_percent: zone_c_percent ?? 20,
        street: street ?? null,
      },
      files: [
        { type: "glb", url: "/mock-concept.glb" },
        { type: "png", url: "/mock-render.png" },
      ],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ run });
  } catch {
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 }
    );
  }
}
