#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm install
npm run build -w @bystend/shared
npm run build -w @bystend/api
npm run build -w @bystend/web
