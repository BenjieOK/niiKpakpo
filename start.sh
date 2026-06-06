#!/bin/bash
# Start both backend and frontend dev servers

echo "Starting Django backend on http://localhost:8000 ..."
cd backend && python3 manage.py runserver &
BACKEND_PID=$!

echo "Starting React frontend on http://localhost:5173 ..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "=================================="
echo " Website:    http://localhost:5173"
echo " Admin Panel: http://localhost:5173/admin"
echo " Django API:  http://localhost:8000/api/"
echo " Django Admin: http://localhost:8000/django-admin/"
echo " Admin Login: username=admin, password=admin123"
echo "=================================="
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
