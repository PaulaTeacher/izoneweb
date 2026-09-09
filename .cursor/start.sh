#!/usr/bin/env bash
# Per-boot runtime init (Cloud Agent `start`): bring PostgreSQL back up.
# The data directory (with seeded data) persists in the snapshot; only the
# server process needs restarting on each boot. Idempotent.
set -euo pipefail

PGVER="$(ls /etc/postgresql 2>/dev/null | sort -n | tail -1)"
if [ -n "$PGVER" ]; then
  sudo pg_ctlcluster "$PGVER" main start 2>/dev/null || true
  for _ in $(seq 1 30); do
    pg_isready -h localhost -p 5432 >/dev/null 2>&1 && break
    sleep 1
  done
  pg_isready -h localhost -p 5432 || echo "warning: PostgreSQL not ready" >&2
fi
