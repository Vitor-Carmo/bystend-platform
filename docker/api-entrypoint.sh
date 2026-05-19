#!/bin/sh
set -e

mkdir -p /app/data

echo "Applying Prisma schema..."
npx prisma db push --skip-generate

run_seed() {
  echo "Running database seed (CSV_DATA_DIR=${CSV_DATA_DIR:-/app/data/csvs})..."
  if ! node apps/api/dist/seed/index.js; then
    echo "ERROR: seed failed. Coloque os CSVs da Byst.end em data/ no host (montado em /app/data/csvs)."
    exit 1
  fi
}

if [ "$SEED_ON_START" = "true" ]; then
  run_seed
elif [ "${SEED_IF_EMPTY:-true}" = "true" ]; then
  CONTENT_COUNT=$(node /app/docker/check-db-empty.cjs)
  if [ "$CONTENT_COUNT" = "0" ]; then
    echo "Database empty — running initial seed..."
    run_seed
  else
    echo "Database has ${CONTENT_COUNT} content(s) — skipping seed (set SEED_ON_START=true to force)."
  fi
fi

echo "Starting API on port ${API_PORT:-4000}..."
exec node apps/api/dist/index.js
