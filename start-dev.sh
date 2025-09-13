#!/bin/bash

echo "Starting SB Works Development Environment..."
echo

echo "Installing server dependencies..."
cd server
npm install
echo

echo "Installing client dependencies..."
cd ../client
npm install
echo

echo "Starting server in background..."
cd ../server
npm start &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 3

echo "Starting client..."
cd ../client
npm start &
CLIENT_PID=$!

echo
echo "Development environment started!"
echo "Server: http://localhost:6001"
echo "Client: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup background processes
cleanup() {
    echo "Stopping servers..."
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait
