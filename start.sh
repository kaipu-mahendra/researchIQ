#!/bin/bash
echo Starting ResearchIQ...
cd backend && source venv/bin/activate && python -m uvicorn main:app --reload &
cd frontend && npm run dev &
wait
