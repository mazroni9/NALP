import { NextResponse } from "next/server";

// TODO: Replace with real persistence (database or external API).
// For now, return empty array. Runs from POST /api/studio/generate are not stored server-side.
// The client stores runs in local state.

const mockRuns: Array<{
  id: string;
  status: string;
  input?: unknown;
  files?: { type: string; url: string }[];
}> = [];

export async function GET() {
  return NextResponse.json({
    runs: mockRuns,
  });
}
