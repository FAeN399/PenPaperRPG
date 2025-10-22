#!/bin/bash

# PenPaperRPG - Start Server Script
# This script starts a local web server to run PenPaperRPG

echo "========================================="
echo "  PenPaperRPG - Pathfinder 2e Creator  "
echo "========================================="
echo ""

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "ERROR: dist folder not found!"
    echo "Please run 'npm run build' first."
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "Starting PenPaperRPG server..."
echo ""

# Try different server options in order of preference
if command_exists npx; then
    echo "Using: npx serve (Node.js)"
    echo "Server will start at: http://localhost:8080"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "========================================="
    echo ""
    npx serve dist -p 8080
elif command_exists python3; then
    echo "Using: Python 3 HTTP Server"
    echo "Server will start at: http://localhost:8080"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "========================================="
    echo ""
    python3 -m http.server 8080 --directory dist
elif command_exists python; then
    echo "Using: Python HTTP Server"
    echo "Server will start at: http://localhost:8080"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "========================================="
    echo ""
    python -m http.server 8080 --directory dist
elif command_exists php; then
    echo "Using: PHP Built-in Server"
    echo "Server will start at: http://localhost:8080"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "========================================="
    echo ""
    php -S localhost:8080 -t dist
else
    echo "ERROR: No suitable web server found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - Node.js (recommended): https://nodejs.org"
    echo "  - Python 3: sudo apt install python3"
    echo "  - PHP: sudo apt install php"
    exit 1
fi
