# Landing islands: the hero film

The hero above the fold on kuberik.com is not a video. It is the dashboard's own Svelte components, compiled from a pinned dashboard checkout, fed a scripted
world (raw Kubernetes CRs that change at set story seconds) and framed like a film: cuts, a cursor, a chapter bar. Every word inside the window is the
product's; the landing adds only the chrome (chapter bar, clock, tally, env strip), the cursor, the NEW tag and the cover stills that hide reflows.

## Find the parts

All film code is in `src/islands/film/`.

| File | Owns |
|---|---|
| `script.ts` | The beats: `CHAPTERS` (chips, `settled` = reduced-motion frame), `SURF` (which view when), `CAMERA` (framing keyframes, set at a cut, then held), `PRESSES` (cursor), `tallyAt` (checks passed / decisions), `PHONE_KEEP` + `storyOf`/`playerOf` (the phone's shorter story), `REST_T`, `NEW_SHINE`. |
| `scenario.ts` | The mock world: `EV` (every story second a CR changes), `PLACES` (dev, staging, five prod regions in three waves), `worldAt(t)` (rollouts, environments, gates, canary steps, tests, health checks, history, GitHub answers). Data only, no display strings. |
| `clock.ts` | `LOOP` (the loop length) and `PTS`, the time-lapse that maps story seconds to the wall clock every timestamp is printed on. |
| `surfaces.ts` | Each view's real page component (`AppShell.svelte`, `RolloutShell.svelte` wrap the real tab layouts) and its route. |
| `targets.ts` | Names in `CAMERA`/`PRESSES` resolved against the product's real DOM (data attributes first, headings second). |
| `Film.svelte` | Draws it: canvas scale, cuts (a frozen still of the outgoing frame dissolves over the incoming one), covers for reflows, camera, cursor, confirm popover, NEW tag, release toast. |
| `Chrome.svelte` | The chapter bar: clock, dev · staging · prod strip (the product's `WaveMark`), chips, play/pause, tally. |
| `Cursor.svelte` | The pointer (desktop arrow, phone touch disc). |
| `index.ts` | Mounts the film, owns the `Player` clock and the world snapshot per event; `host.__story` is the test hook (`at(t)` seeks story seconds and pauses, `t`, `player`). |
| `../surfaces/fleet.ts` | The rest of the fleet (other apps at rest, `payments-svc` as the dependency provider). |

## Change a beat or its timing

- Move an event: edit `EV` in `scenario.ts`. Keep `CHAPTERS`, `CAMERA`, `PRESSES`, `PASSED` (tally) and `PTS` in `clock.ts` in step; they read `EV`.
- Change the loop length: `LOOP` in `clock.ts` (the last `PTS` point sits on it).
- Add a view: a loader in `surfaces.ts`, an entry in `SURF`, a framing in `CAMERA` at the same second.
- Add a press: a `PRESSES` entry plus its target in `targets.ts`. Only `approve` is a real click; other presses are visual (a real click on a product link would navigate the landing page).
- Frame something: a `CAMERA` keyframe at a cut or event (`to` = a `targets.ts` name, `pad`, `foot`, `keep`, `desk` = desktop only). A new framing on the same view is set under a still and dissolves; the camera never glides.
- Phone: the story is `PHONE_KEEP` (release, gates, all sites) played back to back; moves without `desk` apply to the phone.
- Unit tests: `node_modules/.bin/vitest run src/islands/film` (with `DASHBOARD_SRC` set).

## Build the islands

```bash {filename="build"}
DASHBOARD_SRC=/path/to/rollout-dashboard/frontend bash build.sh
```

- `DASHBOARD_SRC` is a dashboard checkout's `frontend/`; it is only read. The commit it was at is written to `../static/islands/BUILT-FROM`: that is the pin. Rebuild from the same commit unless the film is meant to pick up a dashboard change.
- `build.sh` links the dashboard's `node_modules` (or `DASHBOARD_NODE_MODULES`), compiles to `../static/islands/`, regenerates `sources.auto.txt` and subsets the fonts. Set `VITE_CACHE_DIR` to a private directory when other builds share the host.
- A fresh dashboard checkout needs three untracked, git-ignored things before it builds (the dashboard's own files stay untouched): `frontend/node_modules` (a symlink to a checkout's with the same `pnpm-lock.yaml`; the dashboard's own imports resolve from there), `frontend/.svelte-kit` (`svelte-kit sync`, or a copy: `tsconfig.json` extends it) and `src/lib/paraglide` (compiled by the dashboard's vite plugin, or a copy from a checkout with the same `messages/en.json`). Check `src/lib/paraglide/messages/_index.js` is ~100 KB: an 18-byte stub compiles nothing and wipes every string.
- `PYFTSUBSET` points `subset-fonts.sh` at a `pyftsubset` (fonttools) when it is not on the PATH.
- Commit `static/islands/` with the source change. A running Hugo server serves the new files after a few seconds.

## Re-shoot the posters

The poster is the static first frame shown until the film is live (and the frame a visitor sees with JavaScript off). Re-shoot it after any change to the first frame or the chrome:

```bash {filename="posters"}
node scripts/capture-posters.mjs http://127.0.0.1:1313/     # ONLY=348,1118 re-shoots some bands without writing the data file
node scripts/film/poster-match.mjs http://127.0.0.1:1313/ light   # and dark; NOJS=1 for JavaScript off
```

The film zooms a fixed canvas (1000 px from a 600 px window, 390 px below) to the window width W and shows as much of it as the window's height allows; its chapter bar above the window is not zoomed. One bitmap per media band cannot follow that (AD r3: up to 22 % too large, 127 px lost on the right), so the poster is layers that lay out as the film does, inside `.ph-poster`, a size container whose width is W:

- `.ph-win`: the canvas's shell at t=0 (window bar, sidebar), shot at the band's widest W, drawn at `background-size: 100% auto` (the film's scale and top-left at every W, never upscaled); the frame's 11 px corners in CSS. The window is grown to its shot height only AFTER the first frame is aimed: a window that is tall from the start frames differently.
- `.ph-main`: the main column with the camera at 0, shot from that grown window, lifted by the film's own first-frame camera y at each W. The desktop frame lifts its page up to ~11 canvas px so the frame's foot lands in a gap between rows, and that lift changes with the window's height in canvas px (H / k), so with W: the script sweeps every W of every band (one page resized W by W) and writes the runs (`cy`), which become one container rule per change setting `--cy`.
- `.ph-foot`: what the canvas anchors to its bottom (the phone's bottom nav, the sidebar's foot), anchored to the window's bottom.
- `.ph-panel`: the chapter bar's panel in CSS, from its computed paint per theme.
- `.ph-left`, `.ph-center`, `.ph-chrome`: the bar's contents on alpha, anchored as its grid places them (left; centred in the content box, or tight below 1000 in the grid's middle column; right). On the phone the left piece runs to the tabs' scroller edge and is clipped there, as the scroller clips the tabs on a narrow phone.

Bands (`BANDS` in the script) are window widths, each serving windows wider than the previous band's, ~0.93-1.0 scale; the phone and desktop films and the bar's narrow/tight layouts never share one. The page's window widths: vw - 42 to 640 (phone), vw - 74 to 767, 694 to 1023, vw - 146 to 1263, 1118 to 1919, 1438 to 2399, 1598 above; change `BANDS` when hero.css or tokens.css moves them.

It writes `../static/island-poster/p-<W>-<layer>-<theme>.webp` and `../data/island_poster.yaml` (`v:` the posters' content hash, the panel paint, the bands' geometry); `layouts/_shortcodes/island.html` builds the CSS from it and puts the hash on every URL as `?v=`, so a browser never keeps an old poster. Commit the posters and the data file together. `poster-match.mjs` checks every width from 320 to 3840: scale <= 1, 0 px lost, and under 0.5 % of the window's and the bar's pixels differing from the live first frame.

## Verify the film

Run against a served page (`hugo server`, default URL `http://127.0.0.1:1313/`; set `URL=` for another). The scripts import `@playwright/test` through the `node_modules` link `build.sh` creates.

```bash {filename="checks"}
URL=http://127.0.0.1:1313/ bash scripts/film/check-all.sh       # check.mjs x10 + gate.mjs at 1440 and 390; exit 1 on any failure
node scripts/film/gate.mjs 1440 900                              # one width: controls, isolation, every beat
SECS=30 node scripts/film/cls.mjs 1440 900 hero light            # layout shift over one loop
node scripts/film/jitter.mjs 1440 900 light /tmp/jit             # frame pacing of every transition in real play
node scripts/film/jtable.mjs /tmp/jit                            # its per-transition table
node scripts/film/strip.mjs /tmp/jit 'cut gates' strip.png       # the ~60 fps frames of one transition
```

- `check.mjs`: never a blank window (> 250 ms), never a flat frame, spinners and status marks painted, the story advances and wraps, no console errors; reduced motion rests on `REST_T`. Fast 3G included: the story holds at 0 behind the poster until the first view is up.
- The All sites count is the product's: "N of 7 places on 4.46.0-46" counts places running the build in any state, so "7 of 7" appears as wave 3 takes it ("· 2 deploying", "· 2 checking" beside it) and reads clean only once every place is green; the held end is the clean count. The Progress graph needs >= ~864 px of canvas for its five columns (#150): the film's is 894.
- `gate.mjs`: play/pause and chips (a chip seeks; the phone taps), the canvas is inert, the a11y tree holds only the chrome, and each beat enacts its headline in order (toast, NEW, staging, prod pressed, gates, approve, decision at the press, the build moves, 10 / 50 / 100 %, health checks, bake, Progress tab pressed, waves, "7 of 7 places" on screen at the held end). It also asserts the approval is live, with no cover still, 0.4 s before the build moves.
- No jumping: a component holds its box while its state changes (`gate.mjs` asserts 0 px for the strip, the Gates card, the pipeline card, Health checks and the Progress card). Product reflows happen under a still.
- Smooth transitions: `jitter.mjs` logs every animation frame (frame time, camera transform, cover stills, group height) and the compositor's frames; per transition it reports the longest frame, frames over 20 / 33 ms, snaps (a camera change no still covers), reflows (a height change no still covers) and the largest frame-to-frame difference. Pass: 0 snaps, 0 reflows on the transition, no single-frame difference spike (a pop reads as ~7+ on its 0-255 scale; a dissolve stays near 1-4). Its event table is a copy of the `EV` seconds: update it when they move.
- Look yourself: 10 fps sheets of a recorded loop in light and dark at 1440 and at 390 (dark first).

## Keep the owner's rules

- Real dashboard, lightly augmented, calm and colourful (Railway's hero is the reference): no zoom, no gliding camera; the sidebar collapsed; one fixed scale, the dashboard laid out just below its `lg` breakpoint (single column) and scaled up.
- Promotion is the spine: the same build moves dev, staging, prod. Story order: new release (the product's toast "4.46.0-46 released", then NEW; the word is Released, never merged) → staging, quickly → Gates tab (staging promotion, Release approval, Business hours, the dependency; the cursor approves there; the build moves only after every gate passes and the approver's avatar has landed) → canary 10 % → test passes → 50 % → 100 % in about 4 s → prod's health checks pass and the bake holds → all sites on the App page's Progress tab, waves filling, ending all green and held 3 s after the last wave settles, then a 1 s dissolve. The approved state ("Approved by", the approver's avatar) is live, with no cover still, for at least 0.5 s before the build moves; on desktop and phone alike the approval's reflow slides (`FLIP_AT`), the phone's sheet copy fading over it while the frame keeps its top line. Desktop loop 25-30 s (now 28.6 s).
- The phone (390) tells release → gates → pipeline, at its own 390 layout (the Gates card in the product's list form, bottom nav kept); once every site is green it re-frames onto the Progress card's header, so the held end shows the product's count ("7 of 7 places") on screen. The desktop Gates card is the compact two-column graph, whole in frame.
- The cursor causes the view changes (prod in the environment strip, the Progress tab) and presses Approve. It appears only where a person acts. Never a press while a check is pending.
- The tally counts a check the moment it passes on screen; "decision" lights at the Approve press. The chapter bar carries the dev · staging · prod strip, filling as the film runs.
- Chapter titles short, plain, product-true. No jumping: nothing moves position as state changes. Whole components in frame, no word or card sliced at a frame edge.
- Transitions smooth: no dropped frames, snaps, mismatched stills, scroll or reflow jumps, half-painted frames. Measure it (above), in a browser and in recordings.
- The served page shows only the current film: re-shoot the posters with every first-frame change.
- No music, no popover or site picker, no slogans, no overlays carrying numbers the product does not print.

# Section islands: one real component per page section

A section visual (a feature card, a later section) can be the dashboard's own component too, so it never drifts from the product. It is the same
build as the film (shared runtime, shared stylesheet and fonts, the film's chunks reused), one small chunk per island (the Gates card: 2.5 KB gz of its
own), started by the loader only once its host nears the viewport AND the hero has painted its first live frame.

## How a frame is made

`src/islands/sections/section.ts` (`mountSection(ctx, spec)`):

- The component is mounted LIVE under `shared/Scoped.svelte`: its own `$app/state` page and its own query answers (`shared/scope.ts`), so it can be
  the same rollout as the film at another story second without reading or writing the film's. `vite.config.ts` `islandScope` rewrites every dashboard
  `.svelte` file's `import { page } from '$app/state'` into `scopedPage()` at component init; the svelte-query stub captures the scope when a query is
  created. Outside a section island both fall back to the globals: the film is unchanged.
- It lays out on a canvas of the product's own width (container `kc`, as the film's canvas: the product's breakpoints answer it) offstage in the shadow
  root, settles (fonts, no DOM change for 250 ms: the Gates graph measures its ports and draws its wires a frame later), is CLONED into the frame and
  unmounted. The frame is the product's markup and CSS, inert, and nothing the film does later moves it.
- Time: when the film drives the story clock, the section's world is rebased onto it (every ISO timestamp shifted by now - world.now), so its ages are
  its own story's; with no film on the page the section drives the clock.
- Its release catalogue is added to the shared source only if the film's does not already hold it (`base: false`, dropped after the clone).
- Several story times = a calm loop of stills that dissolve (`times`, `holdMs`, `fadeMs`), paused off screen, in a hidden tab and under reduced motion
  (the `rest` still). One time = a still.
- A host width that moves the product's layout re-renders (debounced); any other only re-places the frame.

## Add one

```ts {filename="src/islands/sections/<name>.ts"}
export const mount = (ctx: CustomCtx) => mountSection(ctx, {
	id: 'section-<name>', load: () => import('$lib/components/<Component>.svelte').then((m) => m.default), props: (w) => ({ /* what the route passes */ }),
	page: pageAt('/route/path', '/route/[id]', { /* params */ }), world: (t) => worldAt(t, { /* sibling-world options */ }),
	answers: (w) => answersFrom(() => w.detail, () => w.fleet.rollouts as unknown[], () => w.github), times: [7],
	canvas: (hw) => hw + 68, fit: 'width', frame: (root) => root.querySelector('<selector>'), align: { x: 'start', y: 'start' } });
```

1. The spec above, then a line in `src/registry.ts`: `'<name>': () => import('./islands/sections/<name>').then((m) => ({ custom: m.mount }))`.
2. The host in Hugo: `{{ partial "section-island.html" (dict "name" "<name>" "class" "<slot classes>") }}`. Its box is reserved from
   `data/section_poster.yaml` (step 3 measures it), under `:where()`, so the page's CSS can set a window height over it.
3. Add the island and its island widths to `ISLANDS` in `scripts/section/capture-section-posters.mjs`; build; shoot the posters
   (`node scripts/section/capture-section-posters.mjs <url> <name>`); commit `static/island-poster/s-<name>-*`, `data/section_poster.yaml` with the build.
4. Check: `node scripts/section/cls.mjs 1440 900 light <name>` and `390 844` (total CLS, host box before JS vs live), `REDUCED=1` for reduced motion,
   `node scripts/section/nojs.mjs <name> 1440 dark out.png` (the poster alone), and the film's `check-all.sh` (the hero must not change).

`frame` returns an element or a rect (`rectOf(edges, [bottoms], grow)`: a span cropped on a gutter). `fit: 'width'` corrects the canvas once (then
remembers the correction) until the framed rect is exactly the host's width, since the product's gutters change at its own breakpoints.

## The six feature cards

Each island is a whole product Card, header included (DIRECTION.md §3): the landing draws no header or shell inside its partial
(`layouts/_partials/landing-features/<id>.html` is only the host). They tell one set of facts: checkout-api 4.46.0-46 runs in dev and staging; production
holds it in us-east-1 because payments-svc, which it needs at ^3.1.0, is still baking 3.1.0 there.

| Card | Island | Product component | World, story second |
|---|---|---|---|
| Gates | `gates.ts` | rollout Gates tab, its Gates card (list below 644 px, the #145 two-column graph from 644) | `worldAt(7, depHold, no approval)`, prod us-east-1 |
| Health checks | `health.ts` | rollout Overview, Health checks card | `payments(t)`, prod us-east-1: loop 14.9 (2 pending) -> 16.8 (3/3) |
| Canary and waves | `canary.ts` | App page Progress tab, Progress card | `payments(t)`: loop 11.4, 12.9, 16.8 (step 1, 2, 4 of 5; waves 2 and 3 not reached) |
| Releases | `releases.ts` | App page, Builds card | `held(7)` |
| Dashboard | `dashboard.ts` | Change page for #112, History card | `held(7)` |
| GitOps | `gitops.ts` | rollout Overview, Resources card (staging) | `held(7, 'staging')`. The product has no view of the version Kuberik substitutes into the Kustomization; this is Flux's side |

- `sections/worlds.ts`: `held` is the scenario's held world under its own cluster names (`<env>-held`, never printed), so its release catalogue is its own
  and a build's age does not follow the film's second (the dashboard keys a catalogue by cluster / namespace / source; `section.ts` compares the same key).
  `payments` is the film's own CRs at a second where us-east-1 bakes, with checkout-api renamed payments-svc and its builds 3.0.1 / 3.0.2 / 3.1.0, the
  dependency gate removed and the fleet's at-rest payments-svc left out; `paymentsAnswers` answers the rollout page's queries through the film's
  `answersFrom` in checkout-api's names and renames the answers.
- `source: true` in a spec: the page reads the whole fleet (App page, Change page). `vite.config.ts` `islandSource` rewrites the dashboard's `liveSource()`
  to ask the island scope first (Svelte 5 evaluates every derived and effect under its component's context, so `getContext` works there); a scoped reader
  never reads the film's source, so the film moving does not re-run it.
- Calm loops: `times` with `rest` (the still shown first, under reduced motion and in the poster), `holdMs: 4000`, `fadeMs: 400`.

### Frame a card

- The host reserves the product's natural height per width from `data/section_poster.yaml` (`w` island widths, `h` the tallest still there), under
  `:where()`, answered by the host's own width (`section-island.html` wraps it in a `.sec-slot` container). Natural height falls as the host widens within
  one product layout; the widths include the product's breakpoints in island terms (canvas = island + 32: sm 608, md 736, lg 992) and the Gates graph's 644,
  so the reserve of the widest width not wider than the host is never short.
  The widths are every host width the page's grid gives an island (plateaus, the grid's breakpoints, common devices; the fluid ranges between filled
  at <= ~30 px steps): `node scripts/section/widths.mjs <vw ...>` prints each host with JS off and live, and the poster it shows, MISMATCH where they
  differ. Grid tracks are fractional (424.7): the container query is `min-width: w - 0.5px`, so a track takes its rounded poster, never the one below.
  After a features.css change, run it at 390, 640, 641, 1023, 1024, 1199, 1200, 1280, 1440, 1920, 2399, 2400 and 2560 and add any new width.
- The page's CSS may set a window height over it (the frame is top-left; a shorter window crops its foot). `"attrs" (dict "align-x" "center" "align-y"
  "center" "pad" "12")` on the partial becomes `data-align-x` / `data-align-y` / `data-pad`, which `section.ts` reads when it places the frame.
- Posters: `node scripts/section/capture-section-posters.mjs <url> [name-card ...]` lays each host out on its own bay at every width in its list
  (reduced motion: the rest still), shoots light and dark at 1x, and writes the widths, heights and hash. `look.mjs` takes `W=<px>` (same bay),
  `NATURAL=1` and `ALL=1` (every still of a loop).
- Other checks in `scripts/section/` (playwright from the dashboard's node_modules; `URL` defaults to the preview):
  - `probe.mjs <name> <vw>`: rects, relative to the still, of a few elements in one island's frozen still.
  - `history-check.mjs <outdir> <vw> <theme> <runs>`: fresh loads; the Dashboard card cropped live and ~10 s later, with its event count and whether
    Released and Held are there (5 events: Merged, Released, dev, staging, Held).
  - `features-nojs.mjs <outdir> [vw ...]`: the features section with JavaScript off, light and dark, and each host's width beside the poster it shows.
  - `product-shot.mjs <url> <vw> <theme> <selector> <out.png>`: one element of the running dashboard (hub or mock) at 1x, evidence beside an island.
- No API: the landing has none. A product module that calls one is stubbed (`STUBBED_MODULES` in `vite.config.ts`: `api/pulls.ts` answers the Change
  page's PR from the scope's answers or the fleet's changes feed); as a backstop `shared/no-api.ts` answers any same-origin `/api/` request 503 in the
  page, without a network request, and warns once per path (a missing stub shows as a console warning).

## The Gates card

`sections/gates.ts`: the real Gates tab (`RolloutShell` + the tab route) for checkout-api in prod us-east-1 at story second 7 of a sibling world
(`worldAt(t, { depHold: true, approval: false })`: payments-svc still baking the 3.1.0 that 4.46.0-46 requires holds the release; staging's promotion passed;
Business hours open; no approval gate). The frame is the whole Gates card. From an island width of 644 px it is the compact two-column graph with #145's
wires (454 px tall); below that the stacked list (about 656-692 px). Re-measure when the pin moves.

