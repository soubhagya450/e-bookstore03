@echo off
title eBook Digital Library - Dev Launcher
echo ========================================================
echo    eBook - Free Online Digital Library Platform
echo ========================================================
echo.
echo Starting Flask Backend on http://127.0.0.1:5000 ...
start "eBook Backend" cmd /k "cd backend && python run.py"

echo Starting Vite React Frontend on http://localhost:5173 ...
start "eBook Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services launched!
echo - Public Library: http://localhost:5173
echo - Admin Dashboard: http://localhost:5173/admin/login
echo   (Default admin: admin / admin123)
echo.
pause
