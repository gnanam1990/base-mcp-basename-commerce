# BaseName Commerce

Turn basenames into AI-readable storefronts with Base checkout.

**Status:** Merchant MVP foundation

Let merchants map a basename to products, checkout metadata, and MCP purchase flows for human and agent buyers.

## Current MVP
- Base industrial-neon UI theme from the shared suite prompt.
- Responsive dashboard with wallet/action controls, live storefront metrics, workflow, MCP tools, and record surface.
- File-backed storefront registry with creation, x402 quote lookup, paid purchase execution, and receipt recording.
- Demo x402 flow that returns `402 Payment Required` until a payment header or demo payment approval is provided.
- Product status API at `/api/basename-commerce/status`.
- MCP-compatible JSON endpoint at `/api/mcp/basename-commerce`.
- Smoke checks for creation, listing, quote, unpaid lock, paid unlock, receipt, and MCP quote.

## API Surface
- `GET /api/basename-commerce/storefronts` lists active storefronts.
- `POST /api/basename-commerce/storefronts` creates a storefront.
- `GET /api/basename-commerce/storefronts/:slug/quote` returns the x402 payment requirement.
- `POST /api/basename-commerce/storefronts/:slug/run` executes the paid purchase after payment verification and records a receipt.
- `GET /api/basename-commerce/status` returns dashboard data and stats.
- `GET /api/mcp/basename-commerce` lists MCP tools.
- `POST /api/mcp/basename-commerce` runs MVP tools for discovery, quote preparation, and stats.

## Local Development
```bash
npm install
npm run dev -- -p 3004
```

Open `http://127.0.0.1:3004`.

Local data is written to `.data/basename-commerce-db.json`. Override it with `BASENAME_COMMERCE_DATA_FILE` for isolated runs.

## Environment
Copy `.env.example` to `.env.local` when you need custom payment behavior.

- `BASENAME_COMMERCE_PAYMENT_MODE=demo` accepts the `x-demo-payment: accepted` header for local demos.
- `BASENAME_COMMERCE_PAYMENT_MODE=strict` requires a real `x-payment` header and facilitator configuration.
- `X402_FACILITATOR_URL` points to a facilitator that can verify and settle x402 payments.
- `X402_RECEIVING_ADDRESS` sets the payout address for paid runs.

## Checks
```bash
npm run typecheck
npm run build
npm run test:smoke
```

## Next Build Slice
Resolve real basenames, add product inventory, and prepare Base USDC checkout transactions.

## License
MIT
