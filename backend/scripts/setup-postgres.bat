@echo off
REM PostgreSQL Setup Script for Ladies Tailor Shop (Windows)
REM This script helps set up PostgreSQL database

echo ==================================
echo PostgreSQL Setup for Ladies Tailor Shop
echo ==================================
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X PostgreSQL is not installed!
    echo.
    echo Please install PostgreSQL first:
    echo   Download from https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo + PostgreSQL is installed
echo.

REM Get database credentials
set /p DB_USER="Enter PostgreSQL username [postgres]: "
if "%DB_USER%"=="" set DB_USER=postgres

set /p DB_PASSWORD="Enter PostgreSQL password: "

set /p DB_NAME="Enter database name [ladies_tailor_db]: "
if "%DB_NAME%"=="" set DB_NAME=ladies_tailor_db

echo.
echo Creating database...

REM Create database
set PGPASSWORD=%DB_PASSWORD%
psql -U %DB_USER% -h localhost -c "CREATE DATABASE %DB_NAME%;" 2>nul

if %ERRORLEVEL% EQU 0 (
    echo + Database created successfully
) else (
    echo ! Database might already exist or creation failed
)

echo.
echo Running schema...

REM Run schema
psql -U %DB_USER% -h localhost -d %DB_NAME% -f ..\database\schema_postgres.sql

if %ERRORLEVEL% EQU 0 (
    echo + Schema applied successfully
) else (
    echo X Failed to apply schema
    pause
    exit /b 1
)

echo.
echo Verifying setup...

REM Verify tables
psql -U %DB_USER% -h localhost -d %DB_NAME% -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"

echo.
echo ==================================
echo Setup Complete!
echo ==================================
echo.
echo Database Details:
echo   Host: localhost
echo   Port: 5432
echo   Database: %DB_NAME%
echo   User: %DB_USER%
echo.
echo Next steps:
echo 1. Update your .env file with these credentials
echo 2. Run: cd backend ^&^& npm install
echo 3. Run: npm start
echo.
pause
