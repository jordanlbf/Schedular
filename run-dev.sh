#!/usr/bin/env bash
# run-dev.sh — Start backend (FastAPI) and frontend (Vite) together.
# Usage: ./run-dev.sh
# If you get "Permission denied", run:
#   chmod +x run-dev.sh

set -euo pipefail

# --- Config (override via env) ---
BACKEND_DIR="${BACKEND_DIR:-backend}"
FRONTEND_DIR="${FRONTEND_DIR:-frontend}"
BACKEND_HOST="${BACKEND_HOST:-127.0.0.1}"
BACKEND_PORT="${PORT:-8000}"           # backend port
FRONTEND_PORT="${VITE_PORT:-5173}"     # vite default
UVICORN_APP="${UVICORN_APP:-app:app}"  # module:app

# --- Helpers ---
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
log()  { printf "\033[1;36m[Schedular]\033[0m %s\n" "$*"; }
err()  { printf "\033[1;31m[Error]\033[0m %s\n" "$*" 1>&2; }
have() { command -v "$1" >/dev/null 2>&1; }

kill_on_exit() {
  local code=$?
  if [[ -n "${BACK_PID:-}" ]] && kill -0 "$BACK_PID" 2>/dev/null; then
    kill "$BACK_PID" 2>/dev/null || true
  fi
  if [[ -n "${FRONT_PID:-}" ]] && kill -0 "$FRONT_PID" 2>/dev/null; then
    kill "$FRONT_PID" 2>/dev/null || true
  fi
  wait >/dev/null 2>&1 || true
  exit $code
}
trap kill_on_exit INT TERM EXIT

# --- Pre-flight checks ---
if ! have node; then err "Node.js is not installed. Install Node 20+."; exit 1; fi
if ! have npm;  then err "npm is not installed. Install Node 20+ (includes npm)."; exit 1; fi

if ! have uvicorn; then
  if have python3; then
    UVICORN_CMD=(python3 -m uvicorn)
  elif have python; then
    UVICORN_CMD=(python -m uvicorn)
  else
    err "Neither 'uvicorn' nor a Python interpreter found. Install Python 3.11+ and uvicorn."
    exit 1
  fi
else
  UVICORN_CMD=(uvicorn)
fi

# --- Start backend ---
log "Starting backend (${BACKEND_DIR}) on http://${BACKEND_HOST}:${BACKEND_PORT} …"
(
  cd "$here/$BACKEND_DIR"
  # If you use a .env file, uvicorn will not load it by default;
  "${UVICORN_CMD[@]}" "$UVICORN_APP" --host "$BACKEND_HOST" --port "$BACKEND_PORT" --reload
) & BACK_PID=$!

# --- Start frontend ---
log "Starting frontend (${FRONTEND_DIR}) on http://localhost:${FRONTEND_PORT} …"
(
  cd "$here/$FRONTEND_DIR"
  # Install deps if node_modules missing
  if [[ ! -d node_modules ]]; then
    log "Installing frontend dependencies (one-time)…"
    npm install
  fi
  # Expose backend base URL to Vite
  export VITE_API_BASE="${VITE_API_BASE:-http://${BACKEND_HOST}:${BACKEND_PORT}}"
  npm run dev -- --port "${FRONTEND_PORT}"
) & FRONT_PID=$!

# --- Summary ---
log "Backend PID: ${BACK_PID:-?}"
log "Frontend PID: ${FRONT_PID:-?}"
log "Open frontend: http://localhost:${FRONTEND_PORT}"
log "API is at:    ${VITE_API_BASE:-http://${BACKEND_HOST}:${BACKEND_PORT}}"
log "Press Ctrl+C to stop both."

# --- Wait on both ---
wait "$BACK_PID" "$FRONT_PID"
