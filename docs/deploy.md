# Deploying to thebe

Astro builds this site to `dist/`. Caddy should serve that directory, while Cloudflare Tunnel makes it reachable without opening an inbound router port.

## Build

```sh
pnpm install --frozen-lockfile
pnpm build
```

Copy `dist/` to a stable location on thebe, for example `/srv/elara.boo`.

## Caddy

Add the site to `/etc/caddy/Caddyfile` on thebe. Caddy listens only on localhost because `cloudflared` is the public entry point.

```caddyfile
http://127.0.0.1:8081 {
    root * /srv/elara.boo
    encode zstd gzip
    file_server
}
```

Validate and reload after changing the Caddyfile:

```sh
sudo rc-service caddy reload
```

## Cloudflare Tunnel

Create a named tunnel in the Cloudflare dashboard and map `elara.boo` to `http://127.0.0.1:8081`. Install its generated token as a root-readable OpenRC service on thebe. Do not commit the token or tunnel credentials here.

Cloudflare owns edge TLS. Caddy does not need a public certificate for this localhost origin.
