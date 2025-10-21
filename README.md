# TypeScript Monorepo Template

Production-ready monorepo with pnpm, TypeScript, Effect-TS, Vitest, Playwright, Storybook, Docker, K8s, Fly.io preview deployments.

## Stack

-   **Monorepo**: pnpm workspaces, `apps/` + `packages/`
-   **TypeScript**: Shared base config
-   **Effect-TS**: Functional error handling
-   **Testing**: Vitest (unit) + Playwright (E2E) + Storybook
-   **CI/CD**: GitHub Actions - validate, build, deploy
-   **Docker**: Multi-stage builds (backend/frontend/storybook)
-   **K8s**: Kustomize overlays (staging/production)
-   **Fly.io**: Per-branch preview deployments + auto-cleanup
-   **Lighthouse**: Automated performance testing

## Structure

```
apps/{backend,frontend}    # Applications
packages/helpers           # Shared utilities
packages/config            # Shared config
k8s/{base,overlays}       # Kubernetes manifests
.github/workflows/        # CI/CD pipelines
```

## Quick Start

```bash
pnpm install
pnpm dev          # Start all apps
pnpm test         # Run tests
pnpm build        # Build all
```

## New Shared Package

```bash
# 1. Copy template
cp -r packages/helpers packages/new-package

# 2. Update package.json name and exports
# 4. Install
pnpm install

# 5. Use in apps
{
    "dependencies": {
    "@monorepo/new-package": "workspace:*"
    }
}
```

## Environment Variables

**Local**: Create `apps/{app}/.env`

**Docker**: Pass at runtime via `-e` or `--env-file`

**K8s**: Edit `k8s/base/config.yml` (ConfigMap/Secret) and overlays

**Fly.io**: Edit `.github/workflows/deploy.yml` fly.toml generation

## Docker

```bash
# Build
docker build -t app -f Dockerfile.{backend|frontend} --build-arg APP_NAME={name} .

# Run
docker run -p 3000:3000 app
```

## Deployment

### Fly.io (All Branches)

1. Get API token: `flyctl auth token`
2. Add GitHub Secret: `FLY_API_TOKEN`
3. Push any branch → auto-deploy to `{repo}-{app}-{branch}.fly.dev`
4. Delete branch → auto-cleanup

**Features**: E2E tests on live deploys, Lighthouse CI, PR comments

### Kubernetes (develop/main only)

1. Create GitHub PAT with `read:packages` scope
2. Generate base64 kubeconfig: `cat ~/.kube/config | base64`
3. Add GitHub Secrets: `GHCR_TOKEN`, `KUBECONFIG`
4. Update `k8s/base/kustomization.yml` with your image names
5. Configure `k8s/overlays/{staging,production}` domains/env vars
6. Push: `develop` → staging, `main` → production

Manual deploy:

```bash
kustomize build k8s/overlays/{staging|production} | kubectl apply -f -
```

## API Endpoints

### Backend API

-   `GET /` - Hello World
-   `GET /bookings/next` - Fetch upcoming reservations (JSON)
-   `GET /bookings/summary` - Aggregated statistics about bookings (total, confirmed, cancelled, revenue, by property)
-   `GET /bookings/calendar/full-day.ics` - Full-day booking events (ICS format)
-   `GET /bookings/calendar/checkinout.ics` - Check-in/check-out events (ICS format)
-   `GET /bookings/calendar/full-day.json` - Full-day events (JSON, debug)
-   `GET /bookings/calendar/checkinout.json` - Check-in/check-out events (JSON, debug)

## CI/CD

**validation.yml**: Type-check, lint, test (unit/E2E/Storybook) - runs on every push

**deploy.yml**: Build Docker images → Fly.io deploy → E2E tests → Lighthouse CI → K8s deploy (develop/main only)
