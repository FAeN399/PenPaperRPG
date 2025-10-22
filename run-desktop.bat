@echo off
REM PenPaperRPG Portable Desktop App for Windows

setlocal
set APP_NAME=PenPaperRPG
set APP_DIR=%~dp0

echo Starting %APP_NAME%...

REM Start server in background
where npx >nul 2>nul
if %errorlevel% == 0 (
    start /B npx serve "%APP_DIR%dist" -p 8080 >nul 2>&1
    goto :open_browser
)

where python >nul 2>nul
if %errorlevel% == 0 (
    start /B python -m http.server 8080 --directory "%APP_DIR%dist" >nul 2>&1
    goto :open_browser
)

echo ERROR: No web server found!
echo Please install Node.js from https://nodejs.org
pause
exit /b 1

:open_browser
REM Wait for server
timeout /t 2 /nobreak >nul

REM Try to open in app mode (Chrome)
where chrome >nul 2>nul
if %errorlevel% == 0 (
    start chrome --app=http://localhost:8080 --user-data-dir="%APP_DIR%.chrome-data"
    goto :done
)

REM Fallback to default browser
start http://localhost:8080

:done
echo.
echo %APP_NAME% is now running!
echo Close this window to stop the application.
echo.
pause >nul
