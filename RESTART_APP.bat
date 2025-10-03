@echo off
echo ========================================
echo   FOOTYLYTICS - Complete Restart
echo ========================================
echo.

echo [1/5] Killing all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/5] Clearing Vite cache...
if exist "frontend\node_modules\.vite" rmdir /s /q "frontend\node_modules\.vite"
if exist "frontend\dist" rmdir /s /q "frontend\dist"

echo [3/5] Cache cleared!
echo.
echo [4/5] Starting Backend...
start "Footylytics Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo [5/5] Starting Frontend...
start "Footylytics Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   DONE! Wait 10 seconds then open:
echo   http://localhost:5173
echo ========================================
echo.
echo Press Ctrl+Shift+R in browser to hard reload
pause
