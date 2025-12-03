# Convex integration

This folder contains all Convex-related code for the Media Logger project.

For a deeper overview of how Convex functions (queries, mutations, actions, HTTP actions) work, see the official docs:  
https://docs.convex.dev/functions

## Layout

- `schema.ts`  
  Contains all Convex database schemas (tables and fields).
- `services/`  
  Contains all Convex query and mutation functions used by the app.

---

## Running Convex locally

1. Start the Convex dev server:

```bash
bunx convex dev
```

This runs a local Convex deployment with hot reload.

2. Make changes:

- Edit `schema.ts` for any schema/table changes.
- Add or update query/mutation functions inside the `services` folder.

## Generating & publishing the Convex API package

When you change Convex schema or services, regenerate the typed API and publish the package.

1. Generate Convex client code:

```bash
bunx convex codegen
```

2. Generate the TypeScript API spec:

```bash
bunx convex-helpers ts-api-spec
```

This will create a file like:

convexApiXXXX.ts

3. Move and rename the generated file:

- Rename to:

  convexApi.ts

- Move it to:

  packages/convex-api/src/convexApi.ts

4. Publish the package:

From the repo root, run:

```bash
bun run convex:publish
```

This bumps the version of `packages/convex-api` and publishes it to npm.

> Make sure you are logged in to npm before publishing:

```bash
npm adduser
```

## Required environment variables

For Convex integration to work:

- `CONVEX_URL`
  URL of the Convex deployment your frontend/backend connects to.

- `CONVEX_DEPLOYMENT`
  Deployment name/ID. Required when you are changing schemas or services in the `convex` folder (e.g. during `convex dev` or deploy operations).

## Learn more

- Convex functions (queries, mutations, actions, HTTP actions):
  https://docs.convex.dev/functions
