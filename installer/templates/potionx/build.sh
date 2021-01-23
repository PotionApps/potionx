#!/usr/bin/env bash
# exit on error
set -o errexit

# Initial setup
mix deps.get --only prod
MIX_ENV=prod mix compile

# Compile assets
npm ci --prefix ./frontend/admin
npm run build --prefix ./frontend/admin

# Build the release and overwrite the existing release directory
MIX_ENV=prod mix release --overwrite

# Run migrations
_build/prod/rel/<%= @app_name %>/bin/<%= @app_name %> eval "<%= @app_module %>.Release.migrate"
_build/prod/rel/<%= @app_name %>/bin/<%= @app_name %> eval "<%= @app_module %>.Release.seed"