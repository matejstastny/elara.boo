# elara.boo

The personal site for Ellie Stastna. Astro, no UI framework, two small scripts.

## Development

```sh
pnpm install
pnpm dev
```

`pnpm check` runs the same lint, format and type checks as CI. `pnpm build` writes the static site
to `dist/`.

## Layout

A full-height cover (name, role, contact, tech strip, scroll cue), then bands in priority order:
robotics, projects, linux, school, elara.

Everything readable is in [`src/data/site.ts`](src/data/site.ts). The components only decide how it
looks. A few things worth knowing before editing:

- **The name mark** in [`NameMark.astro`](src/components/NameMark.astro) places its strikes and
  handwriting in `ch` units against the printed name. That only works because the line is
  monospaced, so changing the name means re-checking the character offsets in the comment at the
  top of that file.
- **Icons** are hand-drawn in [`src/data/icons.ts`](src/data/icons.ts) at 24×24, stroked.
- **Tech marks** in [`src/data/tech.ts`](src/data/tech.ts) are generated from simple-icons (CC0)
  and inlined at build time, so the page fetches nothing at runtime. They are drawn monochrome on
  purpose. To add one, grab the path from
  `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/<slug>.svg` and add the slug to
  `techGroups` in `site.ts`. Watch the size - Tux and the Raspberry Pi are ~5 kB of path each.
- **The palette** is copied verbatim from `dotfiles/bin/palette`.
- **Scripts**, both small and both progressive. One at the bottom of
  [`index.astro`](src/pages/index.astro) reveals the back-to-top button after a screen of
  scrolling; without it the button just stays visible. The other is in
  [`Gallery.astro`](src/components/Gallery.astro) and only drives the arrows - the gallery is a
  real horizontal scroll container, so it still swipes and scrolls with no JS at all.
- **`Gallery.astro`** takes a `shots` array and renders a plain figure for one image or an
  arrowed carousel for several. Captions live inside their slides so they cannot fall out of sync
  with the image. Give every shot in a gallery the **same aspect ratio** or the frame will jump
  height as you page through.
- **Clicking a slide** opens it full size in a native `<dialog>`, which brings Esc, the backdrop
  and focus trapping for free. The trigger renders `disabled` and the script enables it, so it is
  never a control that looks clickable but is not. Closing is Esc, the cross, or the backdrop.
- **The scroll lock** behind the lightbox is `html:has(dialog[open])` in `global.css`, not a
  toggled inline style. If a `close` event is ever missed the page cannot get stuck unscrollable.

## Fonts

`public/fonts/*.woff2` are Maple Mono (OFL 1.1), subset to the glyphs this page uses - two weights,
about 40 kB. To regenerate after a font update:

```sh
pyftsubset ~/.local/share/fonts/MapleMono/MapleMono-NF-Regular.ttf \
    --unicodes='U+0020-007E,U+00A0-00FF,U+0104-0107,U+010C-0111,U+0118-011B,U+0139-013E,U+0143-0148,U+0150-0155,U+0158-0165,U+016E-0173,U+0179-017E,U+2018-201D,U+2013-2014,U+2022,U+2026,U+2192,U+2197,U+21B5,U+25A0,U+25AA,U+25B2,U+25B8,U+25C6,U+25CB,U+25CF,U+25D0,U+25D1,U+2605,U+2606,U+2726,U+2727' \
    --layout-features='kern,ccmp,locl,mark,mkmk' \
    --flavor=woff2 --output-file=public/fonts/maple-400.woff2
```

Same again with `-SemiBold.ttf` for `maple-600.woff2`.

## Images

`assets/` holds the full-size originals; `public/img/` holds the optimised webp the site actually
serves. Keeping both means the derived files can be regenerated, at the cost of ~7 MB in the repo.

Project marks are the real repo icons at 128 px. The photos are resized to two or three widths and
served through `srcset`:

```sh
# project marks
magick ~/devel/azalea/assets/icon.png -resize 128x128 -strip public/img/azalea.webp

# the desktop, from the dotfiles screenshot
for w in 1600 1100 760; do
    magick ~/dotfiles/assets/screenshots/kitty.png -resize ${w}x -strip -quality 72 \
        public/img/desktop-$w.webp
done

# the team photo
for w in 1400 900; do
    magick assets/trickfire-group-photo.jpg -resize ${w}x -strip -quality 72 \
        public/img/team-$w.webp
done

# the sim gallery. both are cropped to 16:10 so the frame never changes height;
# sim-b also loses the plugin sidebar and the doubled window chrome
for w in 1400 900; do
    magick assets/sim-showcase-1.png -resize ${w}x -strip -quality 62 \
        -define webp:method=6 public/img/sim-a-$w.webp
    magick assets/sim-showcase-2.png -crop 3980x2487+0+313 +repage -resize ${w}x \
        -strip -quality 74 public/img/sim-b-$w.webp
done
```

To add another sim shot: crop it to 16:10, export `sim-c-1400.webp` and `sim-c-900.webp`, and add
an entry to `shots` on the simulation item in `site.ts`. Nothing else needs touching.

## Deploying

`./deploy.sh` checks and builds locally, ships `dist/` to **thebe** over SSH, unpacks it into
`/srv/elara.boo/releases/<sha>` and flips the `current` symlink. Caddy serves `current` on
`127.0.0.1:8081`; a Cloudflare tunnel on thebe fronts it. The Pi never builds anything.

Host details come from `~/.config/remote/hosts.toml`. Override with `DEPLOY_HOST`, `DEPLOY_USER` or
`DEPLOY_ROOT`.
