@echo off
REM MongoDB and Server Management Script

echo.
echo ================================================
echo   Trackify - MongoDB & Server Management
echo ================================================
echo.

setlocal enabledelayedexpansion

:menu
cls
echo.
echo Choose an option:
echo.
echo 1. Check MongoDB Status
echo 2. Start MongoDB Service
echo 3. Stop MongoDB Service
echo 4. Start Node.js Server
echo 5. View MongoDB Logs
echo 6. Start Everything (MongoDB + Server)
echo 7. Stop Everything
echo 8. Exit
echo.

set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto check_mongo
if "%choice%"=="2" goto start_mongo
if "%choice%"=="3" goto stop_mongo
if "%choice%"=="4" goto start_server
if "%choice%"=="5" goto view_logs
if "%choice%"=="6" goto start_all
if "%choice%"=="7" goto stop_all
if "%choice%"=="8" exit /b

goto menu

:check_mongo
cls
echo.
echo Checking MongoDB Service Status...
echo.
sc query MongoDB
echo.
pause
goto menu

:start_mongo
cls
echo.
echo Starting MongoDB Service...
net start MongoDB
if %errorlevel% equ 0 (
    echo.
    echo MongoDB started successfully!
    echo Waiting for MongoDB to be ready...
    timeout /t 3 /nobreak
) else (
    echo.
    echo MongoDB may already be running or encountered an error.
)
echo.
pause
goto menu

:stop_mongo
cls
echo.
echo Stopping MongoDB Service...
net stop MongoDB
echo.
pause
goto menu

:start_server
cls
echo.
echo ================================================
echo   Starting Node.js Server
echo ================================================
echo.
echo Server will run on: http://localhost:3000
echo.
cd /d "%~dp0"
node server.js
pause
goto menu

:view_logs
cls
echo.
echo Recent MongoDB Logs:
echo.
type "C:\Program Files\MongoDB\Server\8.0\log\mongod.log" | findstr /e /l "error warning info" | tail -20
if %errorlevel% neq 0 (
    echo Could not find MongoDB logs. Check if MongoDB is installed correctly.
)
echo.
pause
goto menu

:start_all
cls
echo.
echo ================================================
echo   Starting MongoDB and Node.js Server
echo ================================================
echo.
echo 1. Starting MongoDB Service...
net start MongoDB
timeout /t 3 /nobreak
echo.
echo 2. Starting Node.js Server...
cd /d "%~dp0"
node server.js
pause
goto menu

:stop_all
cls
echo.
echo ================================================
echo   Stopping Services
echo ================================================
echo.
echo 1. Stopping MongoDB Service...
net stop MongoDB
echo.
echo 2. Stopping Node.js Server (if running)...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo Node.js Server stopped.
) else (
    echo No running Node.js server found.
)
echo.
pause
goto menu

:eof
endlocal
