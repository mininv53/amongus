# plan.md

## 1. Objectives
- Deliver **TruthLens**: a multilingual (EN/RU) anti-deepfake web app that performs **real AI-based analysis** of **images, audio, and URLs**.
- Core flow: **input → OpenAI analysis → Trust Score (0–100) + explainable breakdown → saved result → dashboard insights**.
- High-retention UI: fast feedback loop, clear scoring, shareable results, education snippets; enterprise-ready positioning (landing + API page).

## 2. Implementation Steps

### Phase 1 — Core POC (Isolation): prove AI analysis works end-to-end
**User stories**
1. As a user, I can upload an image and receive a Trust Score with reasons.
2. As a user, I can upload an audio clip and receive a Trust Score with reasons.
3. As a user, I can paste a URL and the system extracts preview + gives a Trust Score.
4. As a user, I can see structured JSON output (score + signals) suitable for UI rendering.
5. As a developer, I can reproduce results locally with a single script and sample files.

**Steps**
- Websearch: best practices for OpenAI **vision** and **audio** analysis prompts + safety + cost controls; verify current models (e.g., GPT-4o).
- Write 1–2 minimal Python scripts:
  - `poc_image.py`: send image to OpenAI Vision; enforce **strict JSON schema** output.
  - `poc_audio.py`: audio → (transcribe if needed) → GPT analysis; strict JSON.
  - `poc_url.py`: fetch URL HTML → extract primary image/video/audio links (basic) → analyze extracted media (start with image-only for POC).
- Define a single shared result schema:
  - `trust_score`, `verdict`, `confidence`, `top_signals[]`, `explanations[]`, `recommended_next_steps[]`, `limitations`.
- Validate failure modes: unsupported file types, huge files, empty/low-quality media, API errors/rate limits.
- Iterate prompts until outputs are stable, consistent JSON, and useful explanations.

**Exit criteria (must pass before Phase 2)**
- Image + audio POC each return valid JSON 10/10 runs on a small sample set.
- URL POC can fetch and analyze at least 1 extracted asset reliably.

---

### Phase 2 — V1 App Development (MVP): build app around proven core
**User stories**
1. As a user, I can choose Image / Audio / URL and run an analysis in <30 seconds.
2. As a user, I can view a clear Trust Score visualization and a concise “why” summary.
3. As a user, I can switch EN/RU and the UI + generated explanations follow the selected language.
4. As a user, I can open a Dashboard and see my recent checks (device-local or server-stored) and re-open results.
5. As an enterprise visitor, I can understand product value quickly from the Landing page and try a live demo.

**Backend (FastAPI)**
- Endpoints:
  - `POST /api/analyze/image` (multipart)
  - `POST /api/analyze/audio` (multipart)
  - `POST /api/analyze/url` (json)
  - `GET /api/analyses/recent` (no auth; scoped by anonymous session id)
  - `GET /api/health`
- Implement analysis service using the **Phase 1 proven prompts** + schema validation.
- Store results in MongoDB: analysis record, timestamps, input type, derived metadata, score, language.
- Add basic URL fetch + extraction (OpenGraph image first; fallback to first `<img>`).
- Add guardrails: file size limits, MIME checks, timeouts, retries, and safe error messages.

**Frontend (React + shadcn/ui)**
- Pages:
  - Landing (product positioning, use-cases, demo CTA)
  - Analyzer (tabs: Image/Audio/URL, drag-drop upload, progress, results)
  - Dashboard (recent analyses list + filters + simple stats)
  - API/Enterprise (high-level docs + contact CTA)
- Retention-first UX:
  - Trust Score ring + “Top 3 signals” above-the-fold
  - Expandable deep-dive section (progressive disclosure)
  - Share result link (public id) + “compare two checks” (optional in V1 if fast)
  - Micro-education cards: “How to verify manually”
- Multilingual:
  - UI i18n (EN/RU)
  - Pass selected language to backend so explanations match.

**End of Phase 2: Testing round**
- Run 1 end-to-end test: upload image/audio, paste URL, verify result rendering, verify Mongo persistence, verify language toggle.

---

### Phase 3 — Hardening + retention upgrades
**User stories**
1. As a user, I can see consistent results even when the API rate-limits or fails temporarily.
2. As a user, I can open a shareable result page that loads fast and looks trustworthy.
3. As a user, I can compare two analyses side-by-side to understand differences.
4. As a user, I can view simple dashboard analytics (score distribution, trend).
5. As a business buyer, I can see clear API limits, example payloads, and compliance posture.

**Steps**
- Reliability: background job queue (lightweight) or async processing; better retries/backoff; caching for URL fetch.
- Result pages: `GET /r/{public_id}` with canonical SEO and clean share UI.
- Improve URL extraction (OpenGraph + favicon + basic media detection).
- Add observability: request logging, latency metrics, OpenAI cost tracking per request.
- UX polish: skeleton loaders, empty states, accessibility pass, performance tuning.

**End of Phase 3: Testing round**
- Run e2e regression: all analyzers, dashboard, sharing, RU/EN, error states.

---

### Phase 4 — Enterprise readiness (optional; after review)
**User stories**
1. As an enterprise user, I can use an API key to call detection endpoints programmatically.
2. As an enterprise user, I can set per-key rate limits and usage caps.
3. As a compliance reviewer, I can see data retention options and deletion controls.
4. As a sales lead, I can request a demo and receive an automated follow-up.
5. As a product owner, I can A/B test landing variants to improve conversion.

**Steps**
- Add API keys + rate limiting (keep public demo endpoints separate).
- Data retention controls + delete endpoint.
- Basic lead capture + outbound email integration.
- A/B testing hooks + analytics events.

## 3. Next Actions
1. Run websearch to confirm best practices + current OpenAI multimodal endpoints.
2. Implement Phase 1 POC scripts (image + audio first; URL extraction minimal).
3. Lock the JSON schema + prompts once stable.
4. Scaffold FastAPI + React app; wire Analyzer to backend.

## 4. Success Criteria
- Core: Image + audio + URL analysis returns valid structured results with Trust Score and explanations reliably.
- UX: Users can complete an analysis in <30s and understand the result within 10s.
- Product: Landing + Analyzer + Dashboard fully functional; multilingual works end-to-end.
- Quality: e2e tests pass for main flows + key failure states; no broken uploads; results persist and render consistently.
