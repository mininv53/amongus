# Testing the DeepGuard frontend (mininv53/amongus)

This is a Create-React-App + Craco app under `frontend/` with three pages of interest:
`/`, `/analyze`, `/dashboard`, `/enterprise`, `/r/:id`. Backend is FastAPI under `backend/` (typically NOT running on a fresh VM).

## Bring it up locally

```bash
cd frontend
yarn install     # first time only — gsap and three are already in package.json
yarn build       # quick gate — should compile clean, ~37s, ~416 KB gz
yarn start       # dev server on http://localhost:3000
```

There is no `lint` / `typecheck` script in `package.json` — `yarn build` is the gate.
There is no pre-commit config to install.

## Known VM limitations

- **Chrome window can't be resized on this VM.** `xdotool windowsize` and `wmctrl` are no-ops here. Don't waste cycles trying to maximize. Screenshots will show the desktop background under the page — that is cosmetic, the page renders correctly. Scroll the page rather than expecting full-page screenshots.
- **Backend is offline by default.** No `uvicorn` running, no `REACT_APP_BACKEND_URL` in `frontend/.env`. Any test that depends on `/api/...` returning real data will see 404 / network error toasts. Design assertions accordingly — usually the right assertion is "the network call was *attempted*" not "a real result came back".

## Things to verify when redesigning visuals

- Hero on `/` should render `Built for the thinkers …` with `thinkers` wrapped in `.glow-pill`. Three.js `ParticleField` should produce ~50+ visible bright dots.
- Trust strip below hero uses GSAP `useCountUp` — final values are **3 / 30s / 0 / 100%**. If you see `0 / 0s / 0 / 1%` after a 2s wait, ScrollTrigger isn't firing.
- Sticky bottom-right CTA appears past 60% of viewport height — toggled via `StickyCTA.js` with a scroll listener.

## Languages — EN / RU / RO

The app supports exactly three languages, no more. All translation keys live in `frontend/src/i18n.js`. The toggle is a **segmented control** (`.segmented` + `.segmented-item`) in Navbar and Footer — *not* a cycle button. To verify a redesign hasn't regressed it:

- EN headline contains `thinkers`, RU contains `кто думает`, RO contains `care gândesc` — each wrapped in the glow-pill.
- Selection persists in `localStorage` under key `lang` and survives navigation.

## /analyze auto-run via `?url=`

`Analyzer.js` reads `searchParams.get('url')` on first mount, sets the URL tab active, pre-fills the input, and immediately runs the scan. The query param is consumed (deleted from the URL) so refreshes don't re-trigger. The inline mini-demo on `/` submits to `/analyze?url=<encoded>` to drive this.

When testing without backend: assert (1) URL ends with `/analyze` (no `?url=`), (2) Link tab is teal-filled, (3) input is pre-filled, (4) an `Analysis failed` toast appears (proves autorun fired the API call). Don't assert on a successful trust score — that needs the backend.

## Emergent removal

The user explicitly does not want Emergent branding in the frontend. After any change touching `index.html`, `package.json`, or `craco.config.js`, verify with:

```bash
curl -s http://localhost:3000/ | grep -c -i emergent      # must be 0
curl -s http://localhost:3000/static/js/bundle.js | grep -c -i 'assets.emergent.sh\|emergent-badge\|@emergentbase\|withVisualEdits'  # must be 0
```

The **backend** still uses `emergentintegrations` (the SDK behind GPT/Claude/Gemini) and `EMERGENT_LLM_KEY` — that is intentional and must stay. Don't remove it.

## Recording tips

- Always start a recording for visual changes; the user expects to see the animations in motion.
- Use `annotate_recording` with `test_start` / `assertion` types — videos slow down around annotations and the user reads them as captions.
- Group related checks into one assertion; don't spam micro-assertions per element.

## Devin Secrets Needed

None for the frontend redesign work. Only needed for full backend integration testing:

- `EMERGENT_LLM_KEY` — used in `backend/analysis_service.py` to authenticate against `emergentintegrations`. Without it, `/api/analyze` returns 500.
- (Optional) MongoDB connection string if testing scan history persistence.
