import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(`${process.env.NEST_URL}/routes`, {
    next: {
      revalidate: 60, //cache bem grande, valor bem grande,
      tags: ["routes"], //revalidação de cache sob demanda
    },
  });

  const data = await response.json();

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${process.env.NEST_URL}/routes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  revalidateTag("routes");

  const data = await response.json();

  return NextResponse.json(data);
}
