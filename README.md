# CBSE 2.0

Centralized portal for CBSE school teachers and students. This was made for the CORE hackathon 2021.

## Requirements

- postgres
- nodejs
- yarn

## Setup

1. Install the dependencies.

```bash
yarn install
```

2. Copy `.env.example` files to `.env`.

```bash
cp packages/web/.env.example packages/web/.env
cp packages/server/.env.example packages/server/.env
```

3. Add the postgres connection url and cookie secret (random string) in `packages/server/.env`.

```bash
COOKIE_SECRET="..."
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/cbse-core?schema=public"
```

4. Create database and run migrations.

```bash
cd packages/server && yarn prisma migrate dev && cd ../..
```

5. Add api url to `packages/web/.env`.

```bash
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

6. Start server and web app in 2 seperate terminal sessions.

```bash
yarn web
```

```bash
yarn server
```

7. The web app should be running on `http://localhost:3000`, along with the server running on `http://localhost:5000`.
