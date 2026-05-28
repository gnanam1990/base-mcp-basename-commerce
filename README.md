# BaseName Commerce

basename-powered storefronts for AI-agent checkout.

**Status:** Planned fifth build after identity and commerce primitives.

BaseName Commerce turns a basename into an agent-readable storefront with product discovery, USDC checkout, and Base MCP purchase execution.

## Why It Exists
Base MCP gives AI assistants access to Base Account actions such as balances, sends, swaps, contract calls, and x402 payments, with user approval for writes. This project turns that capability into a focused product for merchants, creators, Base Name owners, and AI agents that shop or purchase digital goods.

## Core Capabilities
- Merchant dashboard for storefront setup, product catalog, inventory, and pricing.
- Base Name resolution layer that maps names to storefront metadata.
- Public storefront pages optimized for human browsing and AI extraction.
- Purchase prepare endpoints that return unsigned transaction batches.
- MCP plugin for storefront discovery, product lookup, and checkout.

## Roadmap Snapshot
1. Build merchant dashboard and product catalog CRUD.
2. Implement basename lookup and storefront pages.
3. Add USDC checkout and order receipt flow.
4. Expose purchase prepare endpoint and MCP plugin spec.
5. Launch demo merchant storefronts and public docs.

## Repository Status
This repository is public from day one. It starts with product, architecture, roadmap, and demo documentation. Implementation commits should stay small and use conventional commit prefixes.

## License
MIT
