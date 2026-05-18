# Backend

This package contains the Express + TypeScript API, Prisma schema, authentication middleware, and Swagger docs.

## Quick Start

1. Install dependencies.
2. Copy `.env.example` to `.env` and fill in the database connection details.
3. Run `npx prisma generate` to create the Prisma client.
4. Run `npm run dev` to start the API.

## Notes

- Swagger UI is served at `/api/docs`.
- All v1 routes are mounted under `/api/v1`.
- The Prisma schema lives in `prisma/schema.prisma`.
