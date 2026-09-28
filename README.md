# PriceGather

Search and compare grocery products from major Australian supermarkets.

Built with Next.js, PostgreSQL, Prisma and Orama.

<!-- Add these once deployed -->
<!-- [Live Demo](https://...) · [Screenshots](#screenshots) -->

## About

PriceGather is a grocery product search and comparison application.

Product data is collected from Australian supermarket APIs, normalised and stored in PostgreSQL. The data is loaded by Next.js and searched client-side using Orama, allowing products to be searched and sorted without making a new server request for every query.

## Features

- Fast client-side product search
- Compare products from multiple supermarkets
- Sort by name, price, weight and price per 100g
- Unit-price comparison
- Virtualised results for large product catalogues
- Server-side data loading with React Suspense
- Automated product ingestion
- Responsive UI built with shadcn/ui

## How it works

```text
Supermarket APIs
       │
       ▼
Data ingestion
       │
       ▼
Normalisation
       │
       ▼
Prisma ──► PostgreSQL
              │
              ▼
           Next.js
              │
        RSC / Streaming
              │
              ▼
        React Client
              │
              ▼
        Orama Search
              │
              ▼
     Virtualised Results
