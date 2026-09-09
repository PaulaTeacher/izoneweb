#!/usr/bin/env bash
# Dev terminal: run the frontend + API together via Turborepo.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use "$(cat .nvmrc 2>/dev/null || echo 22.22.2)" >/dev/null 2>&1 || true

exec pnpm dev
