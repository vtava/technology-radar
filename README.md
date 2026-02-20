# Technology Radar (JSON-driven)

A modern React + TypeScript web app that renders a complete Technology Radar from a single JSON source at runtime.

## Features
- SVG radar with 4 quadrants and 4 rings (dynamic labels from JSON)
- Dot placement with jitter + retry collision avoidance
- Hover tooltip + click drawer details
- Search, filtering (quadrant/ring/tags/maturity), sorting
- Radar/List view toggle
- Export current JSON config
- Runtime schema validation with Zod
- Unit tests for schema validation and placement logic
- Dockerized production and dev profiles

## Project Structure
- `src/` frontend app and radar logic
- `public/data/radar.json` single runtime configuration
- `Dockerfile` production multi-stage build + nginx
- `Dockerfile.dev` hot-reload dev container
- `docker-compose.yml` prod + optional dev profile

## Run
### Production
```bash
docker compose up --build
```
App: http://localhost:3000

### Development (hot reload)
```bash
docker compose --profile dev up --build radar-web-dev
```
App: http://localhost:5173

### Local npm
```bash
npm ci
npm run dev
```

## JSON configuration
Path: `public/data/radar.json`

Supported shape:
- `title`, `updatedAt`
- `rings[]`: `id`, `label`, `order`, optional `color`
- `quadrants[]`: `id`, `label`
- `entries[]`: `id`, `name`, `quadrantId`, `ringId`, `description`, `tags[]`, `owner`, `lastUpdated`, `links[]`, optional `maturity`/`status`

Validation is enforced in `src/lib/schema.ts` with:
- date format checks
- exactly 4 rings and 4 quadrants
- entry reference integrity (`ringId`, `quadrantId`)

## Placement algorithm
Implemented in `src/lib/placement.ts`:
1. Compute ring annulus by ring order.
2. Compute quadrant angle segment.
3. Seeded random picks radius + angle inside the sector.
4. Collision detection checks prior points (<26px distance).
5. Retry up to 120 times for each entry.

This gives stable placements while reducing overlaps. Labels also have hover tooltips and drawer fallback.

## Extend safely
- Add/rename quadrants and rings directly in `radar.json`.
- Ensure each entry references valid `quadrantId` and `ringId`.
- Keep ring `order` unique and sequential for visual consistency.
- Run `npm test` after edits to validate schema/placement.
