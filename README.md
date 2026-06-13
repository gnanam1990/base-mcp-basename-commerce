# BaseName Commerce

> Turn basenames into AI-readable storefronts with x402 checkout on Base.

## Overview

BaseName Commerce is a Next.js MCP-style server and dashboard that lets merchants map a basename to a small catalog of products, checkout metadata, and purchase flows for both human and agent buyers. It exposes an x402-style HTTP payment surface alongside an MCP-compatible JSON endpoint, so an agent can discover storefronts, request a payment quote, and settle a purchase in USDC. It is a merchant MVP foundation: the data layer is file-backed and seeded with demo records, and the paid flow can run in a demo mode or against a real x402 facilitator.

## Features

- File-backed storefront registry with listing, creation, x402 quote lookup, paid purchase execution, and receipt recording (`lib/mvp-store.ts`).
- x402 payment flow that returns `402 Payment Required` until a valid payment is presented (`lib/mvp-payment.ts`).
- Two payment modes: `demo` accepts an `x-demo-payment: accepted` header so the full paid loop runs without live funds; non-demo (strict) requires an `x-payment` header plus a configured facilitator and calls the facilitator `/verify` and `/settle` endpoints, failing closed on rejection.
- Receipts capture item, amount, network, payment mode, payment-payload hash, optional facilitator reference, and timestamp.
- MCP-compatible JSON endpoint that lists tools and runs MVP tools for discovery, quote preparation, prepared runs, and stats.
- Status endpoint that returns dashboard data and aggregate stats.
- Next.js App Router dashboard UI with wallet/action controls, storefront metrics, workflow, MCP tools, and a record surface.
- Smoke-test script covering status, creation, listing, quote, unpaid lock (402), paid unlock, receipt, and an MCP quote.

## Tech stack

- Next.js (App Router) with React and TypeScript.
- `lucide-react` for icons.
- Node.js built-ins (`fs`, `crypto`) for file-backed persistence and payload hashing.
- No external database is required by default; state is persisted to a local JSON file.

## Architecture

- `lib/mvp-store.ts` — storefront records, aggregate stats, local JSON persistence, and receipts.
- `lib/mvp-payment.ts` — builds x402 payment requirements and verifies demo or facilitator-backed payments.
- `lib/project-data.json` / `lib/types.ts` — seed data and shared types for the dashboard.
- `app/api/basename-commerce/storefronts` — list and create storefronts.
- `app/api/basename-commerce/storefronts/[slug]/quote` — returns the item and its x402 payment requirement.
- `app/api/basename-commerce/storefronts/[slug]/run` — blocks unpaid access with `402`, records paid runs, and emits a `payment-response` header.
- `app/api/basename-commerce/status` — dashboard data and stats.
- `app/api/mcp/basename-commerce` — MCP tool listing and tool execution.
- `app/page.tsx`, `app/layout.tsx`, `app/globals.css` — the dashboard UI.

## Getting started

### Prerequisites

- Node.js 20+ (Next.js 16 and React 19).
- npm.

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env.local` and set values as needed. The app reads the following environment variable names:

| Variable | Purpose |
| --- | --- |
| `BASENAME_COMMERCE_PAYMENT_MODE` | `demo` accepts the `x-demo-payment` header; any other value (e.g. `strict`) requires a real `x-payment` header and a facilitator. Defaults to `demo`. |
| `BASENAME_COMMERCE_X402_NETWORK` | Network identifier used in payment requirements. Defaults to `eip155:8453`. |
| `BASENAME_COMMERCE_DATA_FILE` | Overrides the local data-file path for isolated runs. |
| `X402_FACILITATOR_URL` | Facilitator base URL used to `/verify` and `/settle` payments in non-demo mode. |
| `X402_RECEIVING_ADDRESS` | Payout address embedded in payment requirements. |
| `NEXT_PUBLIC_BASE_CHAIN_ID` | Base chain id for the client. |
| `BASE_RPC_URL` | Base RPC endpoint. |
| `BASE_ACCOUNT_CLIENT_ID` | Base Account client id. |
| `BASE_MCP_URL` | Base MCP endpoint. |
| `X402_DEFAULT_NETWORK` | Default x402 network label. |
| `DATABASE_URL`, `REDIS_URL` | Reserved for future persistence; not required by the current file-backed store. |
| `NEXT_PUBLIC_APP_URL` | Public app URL. |

Never commit real secret values.

### Running

```bash
npm run dev -- -p 3004
```

Open `http://127.0.0.1:3004`.

Local data is written to `.data/basename-commerce-db.json` (or `/tmp` on Vercel). Set `BASENAME_COMMERCE_DATA_FILE` to use a custom path.

## Usage

Key HTTP endpoints:

- `GET /api/basename-commerce/storefronts` — list active storefronts.
- `POST /api/basename-commerce/storefronts` — create a storefront.
- `GET /api/basename-commerce/storefronts/:slug/quote` — return the item and its x402 payment requirement.
- `POST /api/basename-commerce/storefronts/:slug/run` — execute the paid purchase after payment verification and record a receipt.
- `GET /api/basename-commerce/status` — dashboard data and stats.
- `GET /api/mcp/basename-commerce` — list MCP tools.
- `POST /api/mcp/basename-commerce` — run MVP tools (`list_storefronts`, `get_storefront_quote`, `prepare_storefront_run`, `get_basename_commerce_stats`).

Demo paid run:

```bash
curl -X POST http://127.0.0.1:3004/api/basename-commerce/storefronts/<slug>/run \
  -H "content-type: application/json" \
  -H "x-demo-payment: accepted" \
  -d '{}'
```

Without a payment header the same `run` endpoint responds with `402 Payment Required` and an x402 `accepts` block.

## Testing

```bash
npm run typecheck   # next typegen && tsc --noEmit
npm run build       # next build
npm run test:smoke  # node scripts/smoke-test.mjs
```

The smoke test requires a running server (defaults to `http://127.0.0.1:3004`; override with `BASENAME_COMMERCE_BASE_URL`). It exercises status, storefront creation and listing, quote, the unpaid `402` lock, a paid unlock with receipt, and an MCP quote tool.

## Project structure

```
app/
  api/basename-commerce/     storefronts, quote, run, status routes
  api/mcp/basename-commerce/ MCP tool endpoint
  page.tsx, layout.tsx, globals.css
lib/
  mvp-store.ts               records, stats, persistence, receipts
  mvp-payment.ts             x402 requirements and verification
  project-data.json          seed data
  types.ts
scripts/smoke-test.mjs
docs/                        architecture and design notes
```

## Status

Merchant MVP foundation. The dashboard, storefront registry, x402 quote/run flow, receipts, and MCP endpoint are implemented and exercised by the smoke test. Persistence is a local JSON file seeded with demo records; metric figures in the seed data are illustrative. Basenames are stored as plain strings — on-chain basename resolution and real product inventory are not yet implemented. The strict (facilitator) payment path is implemented but depends on a configured external x402 facilitator. No contracts are deployed from this repository.

## License

MIT. See [LICENSE](LICENSE).
