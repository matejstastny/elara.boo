# Deploying to thebe

`deploy.sh` builds and checks the site locally, uploads the finished static artifact to thebe over
SSH, then atomically switches Caddy to it. The Pi never installs project dependencies or builds the
site.

## One-time Pi setup

The infrastructure source of truth lives in the dotfiles repository:

- `pi/services/thebe/Caddyfile` serves `/srv/elara.boo/current` only on `127.0.0.1:8081`

Create the deploy directories once:

```sh
sudo install -d -o elara -g elara -m 755 /srv/elara.boo/releases
sudo rc-service caddy reload
```

## Cloudflare Tunnel

Use a locally managed named tunnel. Its configuration and credentials live on thebe, matching the
other TrickFire deployments and making the DNS route an explicit `cloudflared` command.

1. Add `elara.boo` to Cloudflare and change the nameservers at your domain registrar to the two
   nameservers Cloudflare gives you. Wait until the zone shows **Active**.
2. On thebe, authenticate and choose the `elara.boo` zone in the browser:

```sh
cloudflared tunnel login
```

This saves `/home/elara/.cloudflared/cert.pem`. Keep it private.

3. Create the named tunnel and note the UUID printed by the command:

```sh
cloudflared tunnel create thebe-elara-boo
```

It creates `/home/elara/.cloudflared/<tunnel-uuid>.json`, which is the connector credential.

4. Install the official ARM64 binary on thebe:

```sh
curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 \
    -o /tmp/cloudflared
sudo install -o root -g root -m 755 /tmp/cloudflared /usr/local/bin/cloudflared
rm /tmp/cloudflared
cloudflared --version
```

5. Create the root-owned tunnel configuration, substituting the UUID from the creation command:

```sh
sudo install -d -o root -g root -m 700 /etc/cloudflared
sudo sh -c 'cat > /etc/cloudflared/elara-boo.yml' <<'EOF'
tunnel: <tunnel-uuid>
credentials-file: /home/elara/.cloudflared/<tunnel-uuid>.json
ingress:
  - hostname: elara.boo
    service: http://127.0.0.1:8081
  - service: http_status:404
EOF
```

6. Create the DNS route. This adds the proxied CNAME record, which Cloudflare flattens at the apex:

```sh
cloudflared tunnel route dns thebe-elara-boo elara.boo
```

7. Copy the tunnel service file from the dotfiles checkout to thebe, then install it:

```sh
scp pi/services/thebe/elara-boo-tunnel.initd thebe:/home/elara/
ssh thebe sudo install -o root -g root -m 755 /home/elara/elara-boo-tunnel.initd /etc/init.d/elara-boo-tunnel
```

8. Start it at boot and verify the connector:

```sh
sudo rc-update add elara-boo-tunnel default
sudo rc-service elara-boo-tunnel start
sudo rc-service elara-boo-tunnel status
```

9. Confirm the tunnel is healthy in Cloudflare, then check both origins:

```sh
curl -I http://127.0.0.1:8081
curl -I https://elara.boo
```

Cloudflare terminates public TLS. Caddy deliberately has no public listener or certificate for this
site.

## Routine deployments

From the repository root, run:

```sh
./deploy.sh
```

The script reads the existing `thebe` entry in `~/.config/remote/hosts.toml` when it exists, including
the SSH user and password. On a machine without that file, it uses ordinary SSH instead. Override the
target with `DEPLOY_HOST`, `DEPLOY_USER`, or `DEPLOY_ROOT` when needed.

Each deploy publishes files under `/srv/elara.boo/releases/<commit>`, then atomically repoints
`/srv/elara.boo/current`. Caddy sees the new files immediately without a reload.
