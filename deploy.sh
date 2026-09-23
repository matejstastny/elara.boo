#!/usr/bin/env bash

set -euo pipefail

project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
remote_host="${DEPLOY_HOST:-thebe}"
remote_user="${DEPLOY_USER:-}"
remote_root="${DEPLOY_ROOT:-/srv/elara.boo}"
remote_config="${XDG_CONFIG_HOME:-$HOME/.config}/remote/hosts.toml"

remote_field() {
    awk -v target="$remote_host" -v field="$1" '
        /^\[\[hosts\]\]/ { in_host = 0 }
        $0 == "name = \"" target "\"" { in_host = 1 }
        in_host && $0 ~ "^" field " = " {
            sub(/^[^=]*= "/, "")
            sub(/"$/, "")
            print
            exit
        }
    ' "$remote_config"
}

remote_password=""
remote_jump=""

if [[ -r "$remote_config" ]]; then
    remote_user="${remote_user:-$(remote_field user)}"
    remote_password="$(remote_field password)"
    remote_jump="$(remote_field jump)"
fi

remote_user="${remote_user:-$USER}"
ssh_options=(-o ConnectTimeout=15 -o StrictHostKeyChecking=accept-new)

if [[ -n "$remote_jump" ]]; then
    ssh_options+=(-J "$remote_jump")
fi

remote() {
    if [[ -n "$remote_password" ]]; then
        SSHPASS="$remote_password" sshpass -e ssh "${ssh_options[@]}" "$remote_user@$remote_host" "$@"
    else
        ssh "${ssh_options[@]}" "$remote_user@$remote_host" "$@"
    fi
}

copy_to_remote() {
    if [[ -n "$remote_password" ]]; then
        SSHPASS="$remote_password" sshpass -e scp "${ssh_options[@]}" "$1" "$remote_user@$remote_host:$2"
    else
        scp "${ssh_options[@]}" "$1" "$remote_user@$remote_host:$2"
    fi
}

cd "$project_dir"
pnpm check
pnpm build

release_sha="$(git rev-parse HEAD)"
archive_path="$(mktemp "${TMPDIR:-/tmp}/elara-boo-${release_sha}.XXXXXX.tar.gz")"
remote_archive="/tmp/elara-boo-${release_sha}.tar.gz"
release_path="$remote_root/releases/$release_sha"

trap 'rm -f "$archive_path"' EXIT

tar -C dist -czf "$archive_path" .
copy_to_remote "$archive_path" "$remote_archive"
remote "set -eu; install -d -m 755 '$release_path'; tar -xzf '$remote_archive' -C '$release_path'; rm -f '$remote_archive'; ln -sfn '$release_path' '$remote_root/current'"
remote "curl -fsSI http://127.0.0.1:8081/ | head -n 1"

echo "deployed $release_sha to $remote_host"
