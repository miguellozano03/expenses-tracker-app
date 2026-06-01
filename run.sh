#!/bin/bash

echo "Starting up Docker..."
docker compose up -d

echo "Starting up frontend..."

cd frontend
pnpm run dev &
echo $! > .frontend.pid

wait