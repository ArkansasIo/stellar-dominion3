@echo off
title Universe Empire Dominion - Launcher
color 0A

echo.
echo ========================================================
echo   Universe Empire Dominion - Game Launcher
echo ========================================================
echo.
echo Starting server...
echo.

cd server
start "Universe Empire Dominion - Server" UniverseEmpireDominion-windows.exe

echo Waiting for server to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting client...
cd ..\client
start "Universe Empire Dominion - Client" UniverseEmpireDominion-Client-windows.exe

echo.
echo ========================================================
echo   Game is starting!
echo ========================================================
echo.
echo Server: Running in separate window
echo Client: Opening in your browser
echo.
echo To stop the game:
echo   1. Close your browser
echo   2. Close the server window
echo.
echo Press any key to close this launcher...
pause >nul

@REM Made with Bob
