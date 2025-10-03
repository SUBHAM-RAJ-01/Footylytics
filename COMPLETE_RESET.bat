@echo off
echo ========================================
echo   COMPLETE RESET - Footylytics
echo ========================================
echo.

echo [1/6] Killing all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/6] Clearing Vite cache...
if exist "frontend\node_modules\.vite" rmdir /s /q "frontend\node_modules\.vite"
if exist "frontend\dist" rmdir /s /q "frontend\dist"

echo [3/6] Clearing browser cache instructions...
echo.
echo IMPORTANT: You must clear your browser cache!
echo.
echo Option 1 - Hard Reload:
echo   Press Ctrl+Shift+R in your browser
echo.
echo Option 2 - Clear Cache:
echo   1. Press Ctrl+Shift+Delete
echo   2. Select "Cached images and files"
echo   3. Select "All time"
echo   4. Click "Clear data"
echo.
echo Option 3 - Use Incognito:
echo   Press Ctrl+Shift+N and go to localhost:5173
echo.
pause

echo [4/6] Starting Backend...
start "Footylytics Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo [5/6] Starting Frontend...
start "Footylytics Frontend" cmd /k "cd frontend && npm run dev"

echo [6/6] Done!
echo.
echo ========================================
echo   Wait 15 seconds, then:
echo   1. Close ALL browser tabs
echo   2. Close browser completely
echo   3. Reopen browser
echo   4. Go to: http://localhost:5173
echo   5. Press Ctrl+Shift+R
echo ========================================
pause
