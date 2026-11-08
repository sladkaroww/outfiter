# outfiter.

Social wardrobe app built with Next.js, Clerk and Neon Postgres.

## Local development

```bash
npm install
npm run dev
```

Clerk is configured through `.env.local`. Copy the required database variable from
`.env.example` after creating a Neon Postgres project:

```bash
cp .env.example .env.local
```

Apply the initial database schema from `db/schema.sql` to the Neon branch before
using the API routes. The first UI slice includes a public outfit feed, Clerk
sign-in/sign-up controls, wardrobe management, image previews, and outfit
publishing. The browser demo uses starter data until `DATABASE_URL` and the
schema are configured.

## Deploying to Vercel

Import the repository into Vercel and add the Clerk variables plus
`DATABASE_URL` in the project environment settings. Vercel detects the Next.js
build automatically.
