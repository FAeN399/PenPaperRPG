@echo off
REM PenPaperRPG - Start Server Script for Windows
REM This script starts a local web server to run PenPaperRPG

echo =========================================
echo   PenPaperRPG - Pathfinder 2e Creator
echo =========================================
echo.

REM Change to script directory
cd /d "%~dp0"

REM Check if dist folder exists
if not exist "dist" (
    echo ERROR: dist folder not found!
    echo Please run 'npm run build' first.
    pause
    exit /b 1
)

echo Starting PenPaperRPG server...
echo.

REM Try npx serve first (if Node.js is installed)
where npx >nul 2>nul
if %errorlevel% == 0 (
    echo Using: npx serve (Node.js)
    echo Server will start at: http://localhost:8080
    echo.
    echo Press Ctrl+C to stop the server
    echo =========================================
    echo.
    echo Opening browser in 3 seconds...
    timeout /t 3 /nobreak >nul
    start http://localhost:8080
    npx serve dist -p 8080
    goto :end
)

REM Try python3
where python3 >nul 2>nul
if %errorlevel% == 0 (
    echo Using: Python 3 HTTP Server
    echo Server will start at: http://localhost:8080
    echo.
    echo Press Ctrl+C to stop the server
    echo =========================================
    echo.
    echo Opening browser in 3 seconds...
    timeout /t 3 /nobreak >nul
    start http://localhost:8080
    python3 -m http.server 8080 --directory dist
    goto :end
)

REM Try python
where python >nul 2>nul
if %errorlevel% == 0 (
    echo Using: Python HTTP Server
    echo Server will start at: http://localhost:8080
    echo.
    echo Press Ctrl+C to stop the server
    echo =========================================
    echo.
    echo Opening browser in 3 seconds...
    timeout /t 3 /nobreak >nul
    start http://localhost:8080
    python -m http.server 8080 --directory dist
    goto :end
)

REM Try php
where php >nul 2>nul
if %errorlevel% == 0 (
    echo Using: PHP Built-in Server
    echo Server will start at: http://localhost:8080
    echo.
    echo Press Ctrl+C to stop the server
    echo =========================================
    echo.
    echo Opening browser in 3 seconds...
    timeout /t 3 /nobreak >nul
    start http://localhost:8080
    php -S localhost:8080 -t dist
    goto :end
)

REM No server found
echo ERROR: No suitable web server found!
echo.
echo Please install one of the following:
echo   - Node.js (recommended): https://nodejs.org
echo   - Python 3: https://www.python.org
echo   - PHP: https://www.php.net
echo.
pause
exit /b 1

:end
