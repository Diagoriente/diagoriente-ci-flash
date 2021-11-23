#!/usr/bin/env bash
set -euo pipefail

set -a
. .env
set +a

. .venv/bin/activate

uvicorn cir.interface.http:app --reload &

UVICORN=$!

export REACT_APP_BACKEND_URL=$BACKEND_URL
export PYTHONPATH=./:./backend

cd frontend
npm start

kill $UVICORN
