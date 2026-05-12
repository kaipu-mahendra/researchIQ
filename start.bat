@echo off
echo Starting ResearchIQ...
start cmd /k "cd backend && venv\Scriptsctivate && uvicorn main:app --reload"
timeout /t 3
start cmd /k "cd frontend && npm run dev"
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
pause
