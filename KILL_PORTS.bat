@echo off
echo Killing all Node processes and freeing ports...
echo.

taskkill /F /IM node.exe >nul 2>&1
echo Node processes killed.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /F /PID %%a >nul 2>&1

echo Ports 5000 and 5173 freed.
echo.
echo All ports cleared! You can now start the servers.
pause
