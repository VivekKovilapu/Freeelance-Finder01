@echo off
echo Starting SB Works Development Environment...
echo.

echo Installing server dependencies...
cd server
call npm install
echo.

echo Installing client dependencies...
cd ../client
call npm install
echo.

echo Starting server...
start "SB Works Server" cmd /k "cd server && npm start"
timeout /t 3 /nobreak > nul

echo Starting client...
start "SB Works Client" cmd /k "cd client && npm start"

echo.
echo Development environment started!
echo Server: http://localhost:6001
echo Client: http://localhost:3000
echo.
pause
