# PriceGather

PriceGather is a grocery product search and comparison app for major Australian supermarkets.

[Live Demo](https://pricegather.vercel.app/)

It collects supermarket product data, stores it in PostgreSQL, and provides fast client-side search and sorting so products can be compared by price, weight, and price per 100g.

## Features

- Search supermarket products
- Sort by name, price, weight, or price per 100g
- Compare unit prices
- Virtualised results for large product lists
- Automated product ingestion

## How It Works

```text
Supermarket APIs
      ↓
Data ingestion
      ↓
Prisma
      ↓
PostgreSQL
      ↓
Next.js
      ↓
Orama
      ↓
Virtualised results
```

Product data is collected from supermarket APIs and stored in PostgreSQL.

Next.js loads the products server-side and streams them to the client. Orama then indexes the products in the browser for fast searching and sorting, while TanStack Virtual keeps large result lists responsive.

## Tech Stack

### Core
- Next.js
- React
- TypeScript
- PostgreSQL
- Prisma

### Libraries
- Orama
- TanStack Virtual
- Tailwind CSS
- shadcn/ui
- Vitest

## Getting Started

### Requirements

- Node.js
- pnpm
- PostgreSQL
- A configured `.env` file

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pricegather"
```

### Run Locally

```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm dev
```

Open `http://localhost:3000`.

## Testing

```bash
pnpm vitest
```

With coverage:

```bash
pnpm vitest --coverage
```
