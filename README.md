# elara.boo

The personal site for Matej Stastny, built with Astro and TypeScript.

## Development

```sh
pnpm install
pnpm dev
```

Run the same checks as CI with `pnpm check`. Build the static site with `pnpm build`.

Link content lives in `src/data/site.ts`; the homepage deliberately stays a single, fast static page.

See [deployment notes](docs/deploy.md) for the thebe and Cloudflare Tunnel setup.
