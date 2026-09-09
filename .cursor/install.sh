#!/usr/bin/env bash
# Idempotent bootstrap for the iZone Tech dev environment (Cloud Agent `install`).
# Runs after the repo is checked out. Safe to run repeatedly.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# --- Node ---------------------------------------------------------------------
# @nestjs/cli@12 pulls in @angular-devkit/schematics@22, which requires Node
# >= 22.22.0. The image's default node (22.14.x) triggers ERR_REQUIRE_CYCLE_MODULE
# when `nest build`/`nest start` loads the ESM `ora` dependency, so pin via nvm.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
NODE_VERSION="$(cat .nvmrc 2>/dev/null || echo 22.22.2)"
nvm install "$NODE_VERSION" >/dev/null
nvm use "$NODE_VERSION" >/dev/null
corepack enable >/dev/null 2>&1 || true

# --- PostgreSQL ---------------------------------------------------------------
# No Docker in the cloud image, so install PostgreSQL as a system package.
if ! command -v pg_ctlcluster >/dev/null 2>&1; then
  sudo apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq postgresql postgresql-contrib
fi
PGVER="$(ls /etc/postgresql 2>/dev/null | sort -n | tail -1)"
sudo pg_ctlcluster "$PGVER" main start 2>/dev/null || true
for _ in $(seq 1 30); do
  pg_isready -h localhost -p 5432 >/dev/null 2>&1 && break
  sleep 1
done

# --- DB role + database (credentials match apps/api/docker-compose.yml) --------
sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='user'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE ROLE \"user\" LOGIN PASSWORD 'password';"
sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='izone_db'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE DATABASE izone_db OWNER \"user\";"

# --- Dev env files (git-ignored; dev-only values) -----------------------------
if [ ! -f apps/api/.env ]; then
  cat > apps/api/.env <<'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/izone_db?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/izone_db?schema=public"
PORT=3001
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WHATSAPP_NUMBER="573001234567"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
EOF
fi
if [ ! -f apps/web/.env.local ]; then
  cat > apps/web/.env.local <<'EOF'
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WHATSAPP_NUMBER="573001234567"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
EOF
fi

# --- Workspace dependencies ---------------------------------------------------
pnpm install --frozen-lockfile

# --- Prisma: generate client, sync schema, seed sample data -------------------
pnpm --filter api db:push
pnpm --filter api db:seed

echo "iZone Tech dev environment ready (node $(node -v), postgres cluster $PGVER)."
