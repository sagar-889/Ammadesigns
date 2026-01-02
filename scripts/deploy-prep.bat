@echo off
echo ========================================
echo Amma Designs - Deployment Preparation
echo ========================================
echo.

echo Step 1: Restoring Production Prices...
node backend/scripts/restoreOriginalPrices.js
if %errorlevel% neq 0 (
    echo ERROR: Failed to restore prices
    pause
    exit /b 1
)
echo.

echo Step 2: Checking Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend npm install failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

echo Step 3: Checking Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend npm install failed
    cd ..
    pause
    exit /b 1
)
echo.

echo Step 4: Building Frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

echo ========================================
echo Deployment Preparation Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Update environment variables for production
echo 2. Deploy backend to Render/Railway/Vercel
echo 3. Deploy frontend to Netlify/Vercel
echo 4. Update CORS settings with production URLs
echo 5. Test all features on production
echo.
echo See DEPLOYMENT_COMPLETE.md for detailed instructions
echo.
pause
