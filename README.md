# PriceGather

Search and compare grocery products from major Australian supermarkets.

**Live site:** https://pricegather.vercel.app/

Built with Next.js, PostgreSQL, Prisma and Orama.

## Features

- Fast client-side product search
- Sort by name, price, weight and price per 100g
- Compare unit prices
- Virtualised results for large product lists
- Automated product ingestion

## How it works

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

Next.js loads the products server-side and streams them to the client, where Orama handles fast searching and sorting.

## Tech Stack

- Next.js
- React
- TypeScript
- PostgreSQL
- Prisma
- Orama
- TanStack Virtual
- Tailwind CSS
- shadcn/ui
- Vitest

## Requirements

Before running the project, you will need:

- Node.js
- pnpm
- PostgreSQL
- A configured `.env` file

Example:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pricegather"
```

## Local Development

Install dependencies:

```bash
pnpm install
```

Generate the Prisma client:

```bash
pnpm prisma generate
```

Run database migrations:

```bash
pnpm prisma migrate dev
```

Start the development server:

```bash
pnpm dev
```

## Testing

Run tests:

```bash
pnpm vitest
```

Run tests with coverage:

```bash
pnpm vitest --coverage
```
