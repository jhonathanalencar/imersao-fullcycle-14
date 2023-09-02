import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { routeId: string } }
) {
  const id = params.routeId;
  const response = await fetch(`${process.env.NEST_URL}/routes/${id}`, {
    next: {
      revalidate: 60,
    },
  });

  const data = await response.json();

  return NextResponse.json(data);
}
