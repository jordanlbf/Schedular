@echo off
echo Starting backend...
start cmd /k "cd backend && uvicorn app.main:app --reload --port 8000"

echo Starting frontend...
start cmd /k "cd frontend && npm run dev"

echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
pause
