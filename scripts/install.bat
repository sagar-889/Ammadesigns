@echo off
echo ========================================
echo Ladies Tailor Shop - Installation
echo ========================================
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend installation failed!
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend installation failed!
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Set up MySQL database (see SETUP.md)
echo 2. Create .env files in backend and frontend
echo 3. Run: start-dev.bat
echo.
pause
