#!/usr/bin/env bash
set -euo pipefail

set -a
. .env
set +a

. .venv/bin/activate

export PYTHONPATH=./:./backend
export REACT_APP_BACKEND_URL=$BACKEND_URL
export REACT_APP_STATIC_URL=$STATIC_URL

# Start a local static file server
./simple-cors-http-server.py 8001 2>&1 > log/static-server.log &

# Start the backend
uvicorn cir.interface.http:app --reload 2>&1 > log/uvicorn.log &

# Start the frontend
cd frontend
npm start &

trap "echo Interrupting background jobs; jobs -l; jobs -p | xargs kill" INT

# Wait for all background jobs
wait

