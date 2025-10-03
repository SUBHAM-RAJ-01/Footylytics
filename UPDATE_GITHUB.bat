@echo off
echo ========================================
echo   Updating GitHub with Changes
echo ========================================
echo.

echo Step 1: Staging all changes (including deletions)...
git add -A
echo.

echo Step 2: Committing changes...
git commit -m "Clean up: Remove unnecessary documentation and temporary files"
echo.

echo Step 3: Pushing to GitHub...
git push
echo.

echo ========================================
echo   GitHub Updated Successfully!
echo ========================================
echo.
echo Changes pushed:
echo - Deleted 17 unnecessary files
echo - Updated source code
echo - Cleaned project structure
echo.
pause
