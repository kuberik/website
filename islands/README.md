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
- Commit `static/islands/` with the source change. A running Hugo server serves the new files after a few seconds.

## Re-shoot the posters

The poster is the static first frame shown until the film is live (and the frame a visitor sees with JavaScript off). Re-shoot it after any change to the first frame or the chrome:

```bash {filename="posters"}
node scripts/capture-posters.mjs http://127.0.0.1:1313/
```

It writes `../static/island-poster/p-<width>-<theme>.webp` and `../data/island_poster.yaml` (`v:` = the posters' content hash). The shortcode puts that hash on the poster URL as `?v=`, so a browser never keeps an old poster. Commit the posters and the data file together.

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
- `gate.mjs`: play/pause and chips (a chip seeks; the phone taps), the canvas is inert, the a11y tree holds only the chrome, and each beat enacts its headline in order (toast, NEW, staging, prod pressed, gates, approve, decision at the press, the build moves, 10 / 50 / 100 %, health checks, bake, Progress tab pressed, waves, "7 of 7 places" on screen at the held end). It also asserts the approval is live, with no cover still, 0.4 s before the build moves.
- No jumping: a component holds its box while its state changes (`gate.mjs` asserts 0 px for the strip, the Gates card, the pipeline card, Health checks and the Progress card). Product reflows happen under a still.
- Smooth transitions: `jitter.mjs` logs every animation frame (frame time, camera transform, cover stills, group height) and the compositor's frames; per transition it reports the longest frame, frames over 20 / 33 ms, snaps (a camera change no still covers), reflows (a height change no still covers) and the largest frame-to-frame difference. Pass: 0 snaps, 0 reflows on the transition, no single-frame difference spike (a pop reads as ~7+ on its 0-255 scale; a dissolve stays near 1-4). Its event table is a copy of the `EV` seconds: update it when they move.
- Look yourself: 10 fps sheets of a recorded loop in light and dark at 1440 and at 390 (dark first).

## Keep the owner's rules

- Real dashboard, lightly augmented, calm and colourful (Railway's hero is the reference): no zoom, no gliding camera; the sidebar collapsed; one fixed scale, the dashboard laid out just below its `lg` breakpoint (single column) and scaled up.
- Promotion is the spine: the same build moves dev, staging, prod. Story order: new release (the product's toast "4.46.0-46 released", then NEW; the word is Released, never merged) → staging, quickly → Gates tab (staging promotion, Release approval, Business hours, the dependency; the cursor approves there; the build moves only after every gate passes and the approver's avatar has landed) → canary 10 % → test passes → 50 % → 100 % in about 4 s → prod's health checks pass and the bake holds → all sites on the App page's Progress tab, waves filling, ending all green and held 3 s after the last wave settles, then a 1 s dissolve. The approved state ("Approved by", the approver's avatar) is live, with no cover still, for at least 0.5 s before the build moves. Desktop loop 25-30 s (now 28.6 s).
- The phone (390) tells release → gates → pipeline, at its own 390 layout (the Gates card in the product's list form, bottom nav kept); once every site is green it re-frames onto the Progress card's header, so the held end shows the product's count ("7 of 7 places") on screen. The desktop Gates card is the compact two-column graph, whole in frame.
- The cursor causes the view changes (prod in the environment strip, the Progress tab) and presses Approve. It appears only where a person acts. Never a press while a check is pending.
- The tally counts a check the moment it passes on screen; "decision" lights at the Approve press. The chapter bar carries the dev · staging · prod strip, filling as the film runs.
- Chapter titles short, plain, product-true. No jumping: nothing moves position as state changes. Whole components in frame, no word or card sliced at a frame edge.
- Transitions smooth: no dropped frames, snaps, mismatched stills, scroll or reflow jumps, half-painted frames. Measure it (above), in a browser and in recordings.
- The served page shows only the current film: re-shoot the posters with every first-frame change.
- No music, no popover or site picker, no slogans, no overlays carrying numbers the product does not print.
