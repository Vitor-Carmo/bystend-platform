#!/bin/sh
set -e

mkdir -p /app/data

echo "Applying Prisma schema..."
npx prisma db push --skip-generate

if [ "$SEED_ON_START" = "true" ]; then
  echo "Running database seed..."
  node apps/api/dist/seed/index.js
fi

echo "Starting API on port ${API_PORT:-4000}..."
exec node apps/api/dist/index.js
