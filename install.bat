@echo off
REM ═══════════════════════════════════════════════════════════════
REM   FlyEasy Tourism Platform — Windows Auto-Deploy Script
REM   Usage: Double-click OR run: install.bat
REM ═══════════════════════════════════════════════════════════════

title FlyEasy Installer
color 0B

echo.
echo  ╔═══════════════════════════════════════════════╗
echo  ║   FlyEasy Tourism Platform — Windows Setup    ║
echo  ╚═══════════════════════════════════════════════╝
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found!
    echo  Please download and install Node.js from https://nodejs.org
    echo  Minimum version: 18.x
    pause
    exit /b 1
)

echo  [OK] Node.js found: 
node --version

REM Check MySQL / mysqladmin
mysqladmin --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  [WARNING] MySQL client (mysqladmin) not found in PATH.
    echo  The installer will still proceed — enter correct DB credentials.
    echo.
)

echo.
echo  Launching FlyEasy Setup Wizard...
echo.

node install.js

echo.
echo  ═══════════════════════════════════════════════
echo  To start the backend server:
echo    cd backend
echo    node server.js
echo.
echo  To serve frontend:
echo    cd frontend\dist
echo    npx serve .
echo  ═══════════════════════════════════════════════
echo.
pause
