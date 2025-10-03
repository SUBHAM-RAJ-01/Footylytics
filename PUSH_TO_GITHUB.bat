@echo off
echo ========================================
echo   Pushing Footylytics to GitHub
echo ========================================
echo.

echo Step 1: Initializing Git repository...
git init
echo.

echo Step 2: Adding all files...
git add .
echo.

echo Step 3: Creating first commit...
git commit -m "Initial commit: Footylytics - Football Analytics Platform"
echo.

echo Step 4: Setting main branch...
git branch -M main
echo.

echo Step 5: Adding remote repository...
git remote add origin https://github.com/SUBHAM-RAJ-01/Footylytics.git
echo.

echo Step 6: Pushing to GitHub...
git push -u origin main
echo.

echo ========================================
echo   Successfully pushed to GitHub!
echo ========================================
echo.
echo Your repository is now live at:
echo https://github.com/SUBHAM-RAJ-01/Footylytics
echo.
pause
