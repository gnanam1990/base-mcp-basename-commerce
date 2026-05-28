import { NextResponse } from "next/server";
import { createItem, listItems } from "@/lib/mvp-store";

function numeric(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function GET() {
  return NextResponse.json({ data: listItems() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    descriptor?: string;
    detail?: string;
    priceUsdc?: number | string;
    payload?: Record<string, unknown>;
  };

  const item = createItem({
    name: body.name?.trim() || "Untitled Storefront",
    descriptor: body.descriptor?.trim() || "2 products",
    detail: body.detail?.trim() || "USDC checkout",
    priceUsdc: numeric(body.priceUsdc, 1.5),
    payload: body.payload || {"orderStatus":"ready","delivery":"digital","sku":"smoke-kit"},
  });

  return NextResponse.json({ data: item }, { status: 201 });
}
