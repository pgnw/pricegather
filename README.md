# PriceGather

PriceGather is a grocery product search and comparison app for major Australian supermarkets.

[Live Site](https://pricegather.vercel.app/)

<img
  src="https://github.com/user-attachments/assets/7494e688-7e80-4f59-8ffd-5b310295f8d7"
  alt="PriceGather product search showing apple results"
  width="850"
/>

Product data is collected from supermarket APIs, stored in PostgreSQL, and searched client-side with Orama for fast filtering and sorting.

## Features

- Search supermarket products
- Sort by name, price, weight, or price per 100g
- Compare unit prices
- Virtualised results for large product lists
- Automated product ingestion

## Tech Stack

### Core
- Next.js
- React
- TypeScript
- PostgreSQL
- Prisma

### Search, UI & Testing
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

Run with coverage:

```bash
pnpm vitest --coverage
```
