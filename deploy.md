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

Use a remotely managed named tunnel. It is the cleanest fit here because Cloudflare stores the
hostname and origin mapping, while thebe keeps only a single revocable tunnel token.

1. Add `elara.boo` to Cloudflare and change the nameservers at your domain registrar to the two
   nameservers Cloudflare gives you. Wait until the zone shows **Active**.
2. In Cloudflare Zero Trust, open **Networks → Tunnels** and create `thebe-elara-boo`.
3. Add a Linux connector, then copy its token without saving it in a shell history or this repo.
4. In the tunnel's **Routes** tab, add a published application:
    - hostname: `elara.boo`
    - service type: `HTTP`
    - URL: `http://localhost:8081`
5. Install the official ARM64 binary on thebe:

```sh
curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 \
    -o /tmp/cloudflared
sudo install -o root -g root -m 755 /tmp/cloudflared /usr/local/bin/cloudflared
rm /tmp/cloudflared
cloudflared --version
```

6. Copy `pi/services/thebe/elara-boo-tunnel.initd` from the dotfiles checkout to thebe, then install
   it as `/etc/init.d/elara-boo-tunnel`:

```sh
scp pi/services/thebe/elara-boo-tunnel.initd thebe:/home/elara/elara-boo-tunnel.initd
ssh thebe sudo install -o root -g root -m 755 /home/elara/elara-boo-tunnel.initd /etc/init.d/elara-boo-tunnel
```

On thebe, create the root-only service configuration:

```sh
sudo sh -c 'umask 077; cat > /etc/conf.d/elara-boo-tunnel'
```

Paste this line into the second command, substituting the tunnel token, then press `Ctrl-D`:

```sh
TUNNEL_TOKEN='paste-the-token-here'
```

The token stays only in `/etc/conf.d/elara-boo-tunnel`, never in this repository.

7. Start it at boot and verify the connector:

```sh
sudo rc-update add elara-boo-tunnel default
sudo rc-service elara-boo-tunnel start
sudo rc-service elara-boo-tunnel status
```

8. Confirm the tunnel is healthy in Cloudflare, then check both origins:

```sh
curl -I http://127.0.0.1:8081
curl -I https://elara.boo
```

Cloudflare creates the required DNS record when you publish the hostname and terminates public TLS.
Caddy deliberately has no public listener or certificate for this site.

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
