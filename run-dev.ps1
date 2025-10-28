# Starts FastAPI and Vite together
Start-Process powershell -ArgumentList "cd backend; uvicorn app.main:app --reload --port 8000"
Start-Process powershell -ArgumentList "cd frontend; npm run dev"
