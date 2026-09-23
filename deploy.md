# Deploying to thebe

`main` is the production branch. Every push builds and checks the site on a GitHub-hosted runner,
then the dedicated thebe runner atomically switches Caddy to that finished artifact. The Pi never
installs project dependencies or runs pull-request code.

## One-time Pi setup

The infrastructure source of truth lives in the dotfiles repository:

- `pi/services/thebe/Caddyfile` serves `/srv/elara.boo/current` only on `127.0.0.1:8081`
- `pi/services/thebe/github-runner/` installs the unprivileged deployment runner

Apply the Caddy configuration and create the site directories:

```sh
sudo install -d -o actions -g actions -m 755 /srv/elara.boo/releases
sudo rc-service caddy reload
```

The runner installer creates the `actions` user when it is not present, so install the runner before
creating the directory if this is a fresh host.

## Cloudflare Tunnel

Use a remotely managed named tunnel. It is the cleanest fit here because Cloudflare stores the
hostname and origin mapping, while thebe keeps only a single revocable tunnel token.

1. In Cloudflare Zero Trust, open **Networks → Tunnels** and create `thebe-elara-boo`.
2. Add a Linux connector, then copy its token without saving it in a shell history or this repo.
3. In the tunnel's **Routes** tab, add a published application:
    - hostname: `elara.boo`
    - service type: `HTTP`
    - URL: `http://localhost:8081`
4. Install `cloudflared` and register its OpenRC service on thebe using the token. The service must
   run at boot and its token file must be readable only by root.
5. Confirm the tunnel is healthy in Cloudflare, then check both origins:

```sh
curl -I http://127.0.0.1:8081
curl -I https://elara.boo
```

Cloudflare creates the required DNS record when you publish the hostname and terminates public TLS.
Caddy deliberately has no public listener or certificate for this site.

## Self-hosted deployment runner

The runner is repository-specific, called `thebe-elara-boo`, and has only `thebe` and `deploy` custom
labels. The deploy workflow selects all of these labels, so normal CI can never land on the Pi.

Register it with a short-lived token from your local machine:

```sh
gh api --method POST repos/matejstastny/elara.boo/actions/runners/registration-token --jq .token
```

Pass that token once to `pi/services/thebe/github-runner/install` over SSH. The installer downloads the
current ARM64 runner, registers it as the unprivileged `actions` user, and enables an OpenRC service.
Afterward, verify it in **GitHub → Settings → Actions → Runners** and with:

```sh
rc-service elara-boo-runner status
```

Keep the repository's CI on GitHub-hosted runners. Self-hosted runners are persistent machines, so a
public repository must never use one for pull request jobs. The deploy runner receives only a built
artifact from a successful trusted `main` build.

## Routine deployments

Push to `main` or run **Actions → Deploy → Run workflow**. The workflow keeps only one deploy active,
publishes files under `/srv/elara.boo/releases/<commit>`, then atomically repoints
`/srv/elara.boo/current`. Caddy sees the new files immediately without a reload.
