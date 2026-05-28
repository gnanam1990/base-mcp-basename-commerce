# BaseName Commerce Architecture

## Product Role
BaseName Commerce turns a basename into an agent-readable storefront with product discovery, USDC checkout, and Base MCP purchase execution.

## System Shape
- Frontend app: Next.js, TypeScript, Tailwind, shadcn-style components, responsive dashboards.
- API layer: Node/TypeScript endpoints for product reads, prepare flows, analytics, and x402-gated access.
- Base layer: Base Account for user approval and Base MCP for assistant-driven actions.
- Payment layer: x402 for paid API/content/service access using USDC on Base or Base Sepolia.
- Data layer: PostgreSQL for durable product state and Redis for cache/session/rate-limit workloads.
- Contracts: Solidity/Foundry only where the module needs onchain state or settlement logic.

## Main Modules
- Merchant dashboard for storefront setup, product catalog, inventory, and pricing.
- Base Name resolution layer that maps names to storefront metadata.
- Public storefront pages optimized for human browsing and AI extraction.
- Purchase prepare endpoints that return unsigned transaction batches.
- MCP plugin for storefront discovery, product lookup, and checkout.

## Data Model
- Merchant profiles, basename mappings, and storefront metadata.
- Products, prices, inventory, digital delivery references, and order state.
- Payment receipts, fulfilled orders, and buyer-facing confirmations.
- MCP discovery and purchase request logs.

## MCP And x402 Pattern
Every write action should be exposed as a prepare endpoint that returns unsigned calldata or a payment request. MCP/plugin documentation must explain onboarding, read endpoints, prepare endpoints, and the mapping into Base MCP actions.

For paid resources, endpoints should return an x402 payment requirement before serving premium data. The app must enforce a user-defined max payment cap and record receipts for analytics and support.

## Safety Defaults
- Base Sepolia first, then Base mainnet.
- No private keys in app config.
- No hidden approvals or auto-execution.
- Clear user review before paid access or onchain writes.
- Placeholder env vars only in committed files.
