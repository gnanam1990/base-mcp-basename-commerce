import { NextResponse } from "next/server";
import projectData from "@/lib/project-data.json";
import { findItem, listItems, projectStats } from "@/lib/mvp-store";

const tools = [
  ...projectData.tools,
  "list_storefronts",
  "get_storefront_quote",
  "prepare_storefront_run",
  "get_basename_commerce_stats",
];

export function GET() {
  return NextResponse.json({
    server: "basename-commerce-mcp",
    version: "0.1.0",
    tools,
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    tool?: string;
    arguments?: {
      query?: string;
      slug?: string;
    };
  };

  if (projectData.tools.includes(body.tool || "") || body.tool === "list_storefronts") {
    const query = body.arguments?.query?.toLowerCase() ?? "";
    const results = listItems().filter((item) =>
      [item.name, item.descriptor, item.detail].some((value) => value.toLowerCase().includes(query)),
    );
    return NextResponse.json({ data: results });
  }

  switch (body.tool) {
    case "get_storefront_quote": {
      const item = body.arguments?.slug ? findItem(body.arguments.slug) : undefined;
      if (!item) {
        return NextResponse.json({ error: "storefront_not_found" }, { status: 404 });
      }
      return NextResponse.json({
        data: {
          slug: item.slug,
          priceUsdc: item.priceUsdc,
          resource: `/api/basename-commerce/storefronts/${item.slug}/run`,
          network: process.env.BASENAME_COMMERCE_X402_NETWORK || "eip155:8453",
        },
      });
    }
    case "prepare_storefront_run": {
      const item = body.arguments?.slug ? findItem(body.arguments.slug) : undefined;
      if (!item) {
        return NextResponse.json({ error: "storefront_not_found" }, { status: 404 });
      }
      return NextResponse.json({
        data: {
          method: "POST",
          resource: `/api/basename-commerce/storefronts/${item.slug}/run`,
          maxPayment: `${item.priceUsdc.toFixed(3)} USDC`,
        },
      });
    }
    case "get_basename_commerce_stats":
      return NextResponse.json({ data: projectStats() });
    default:
      return NextResponse.json({ error: "unknown_tool" }, { status: 400 });
  }
}
