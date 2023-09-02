import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const originWaypoint = url.searchParams.get("originWaypoint");
  const destinationWaypoint = url.searchParams.get("destinationWaypoint");
  const body = await request.json();

  const response = await fetch(
    `${process.env.NEST_URL}/directions?originWaypoint=${originWaypoint}&destinationWaypoint=${destinationWaypoint}`,
    {
      next: {
        revalidate: 60,
      },
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  return NextResponse.json(data);
}
