# Scalable REST API with Authentication & Role-Based Access Control

## Tech Stack

- Backend: Node.js, Express.js, TypeScript
- Database: PostgreSQL with Prisma ORM
- Authentication: JWT access tokens and bcrypt password hashing
- Documentation: Swagger via swagger-jsdoc and swagger-ui-express
- Frontend: React.js, Vite, TypeScript, Axios
- Hardening: Helmet and express-rate-limit

## Prerequisites

- Node.js 18 or newer
- PostgreSQL 14 or newer
- npm 9 or newer
- A `.env` file for the backend and a `VITE_API_URL` value for the frontend

## Installation & Setup

### Backend

1. Change into the backend folder.
2. Install dependencies with `npm install`.
3. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` and `JWT_SECRET`.
4. Run `npx prisma generate`.
5. Create and migrate the database with `npx prisma migrate dev --name init`.
6. Start the API with `npm run dev`.

### Frontend

1. Change into the frontend folder.
2. Install dependencies with `npm install`.
3. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL=http://localhost:5000` or your API base URL.
4. Start the app with `npm run dev`.

## Environment Variables

### Backend

- `DATABASE_URL` = PostgreSQL connection string
- `JWT_SECRET` = signing secret for access tokens
- `JWT_EXPIRES_IN` = token lifetime, default `7d`
- `PORT` = API port, default `5000`
- `NODE_ENV` = runtime environment

### Frontend

- `VITE_API_URL` = backend base URL used by Axios

## Running the App

- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`
- Swagger UI: `http://localhost:5000/api/docs`
- Health check: `http://localhost:5000/health`

## Swagger Documentation

- Open Swagger UI at `http://localhost:5000/api/docs` after starting the backend.
- Use **Authorize** in Swagger and paste your JWT as `Bearer <token>`.
- You can test all auth and task endpoints directly from the Swagger page.

## API Endpoints Table

| Method | Route | Auth | Role | Description |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/auth/register` | No | Any | Register a new user and return a JWT token |
| POST | `/api/v1/auth/login` | No | Any | Authenticate a user and return a JWT token |
| GET | `/api/v1/tasks` | Yes | User/Admin | List own tasks for users, all tasks for admins |
| GET | `/api/v1/tasks/:id` | Yes | User/Admin | Read a single task if owner or admin |
| POST | `/api/v1/tasks` | Yes | User/Admin | Create a new task for the current user |
| PATCH | `/api/v1/tasks/:id` | Yes | User/Admin | Update a task if owner or admin |
| DELETE | `/api/v1/tasks/:id` | Yes | User/Admin | Delete a task if owner or admin |

## Database Schema Diagram

```text
USER
  id PK
  name
  email UNIQUE
  password
  role (USER | ADMIN)
  createdAt
  updatedAt
     1
     |
     | owns
     |
     N
TASK
  id PK
  title
  description NULL
  status (TODO | IN_PROGRESS | DONE)
  userId FK -> User.id
  createdAt
  updatedAt
```

## Scalability Notes

- Stateless JWT makes the API safe to scale horizontally behind a load balancer.
- Prisma works well with connection pooling in production, ideally through PgBouncer.
- A Redis cache can speed up frequent `GET /api/v1/tasks` requests.
- `express-rate-limit` helps reduce abuse by limiting requests per IP.
- The module-based structure keeps auth and tasks isolated for future microservice extraction.
- The project is Docker-ready and can be wrapped with a backend Dockerfile plus a compose file for PostgreSQL and the API.
- CI/CD should use GitHub Actions to run linting, tests, and deployment in sequence.

## Project Structure Tree

```text
root/
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── types/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
└── frontend/
    ├── index.html
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── .env.example
    ├── package.json
    └── vite.config.ts
```