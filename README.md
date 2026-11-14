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
using the API routes. Wardrobe images use a private Neon Object Storage bucket;
configure the AWS-compatible variables from `.env.example` and set
`NEON_STORAGE_BUCKET` to `wardrobe-images`. The app stores only the object key
in Postgres and creates signed download URLs when loading the wardrobe.

## Deploying to Vercel

Import the repository into Vercel and add the Clerk variables, `DATABASE_URL`,
and the Neon Object Storage variables in the project environment settings.
Vercel detects the Next.js build automatically.
