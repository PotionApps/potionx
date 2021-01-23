#!/usr/bin/env bash
# exit on error
set -o errexit

# Initial setup
mix deps.get --only prod
MIX_ENV=prod mix compile

# Compile assets
npm install --prefix ./frontend/admin
npm run build --prefix ./frontend/admin

# Build the release and overwrite the existing release directory
MIX_ENV=prod mix release --overwrite