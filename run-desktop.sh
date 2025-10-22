#!/bin/bash

# PenPaperRPG Portable Desktop App
# This creates a self-contained desktop application

APP_NAME="PenPaperRPG"
VERSION="0.1.0"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start the server in background
start_server() {
    echo "Starting $APP_NAME..."

    # Try to find a server
    if command -v npx >/dev/null 2>&1; then
        npx serve "$SCRIPT_DIR/dist" -p 8080 >/dev/null 2>&1 &
    elif command -v python3 >/dev/null 2>&1; then
        python3 -m http.server 8080 --directory "$SCRIPT_DIR/dist" >/dev/null 2>&1 &
    else
        echo "ERROR: No web server found!"
        exit 1
    fi

    SERVER_PID=$!
    echo "Server started (PID: $SERVER_PID)"

    # Wait for server to start
    sleep 2

    # Open in app mode (looks like desktop app)
    if command -v google-chrome >/dev/null 2>&1; then
        google-chrome --app=http://localhost:8080 --user-data-dir="$SCRIPT_DIR/.chrome-data" >/dev/null 2>&1 &
    elif command -v chromium >/dev/null 2>&1; then
        chromium --app=http://localhost:8080 --user-data-dir="$SCRIPT_DIR/.chrome-data" >/dev/null 2>&1 &
    elif command -v firefox >/dev/null 2>&1; then
        firefox --new-window http://localhost:8080 >/dev/null 2>&1 &
    else
        xdg-open http://localhost:8080 >/dev/null 2>&1 &
    fi

    echo "$APP_NAME is now running!"
    echo "Close this terminal to stop the app."

    # Wait for interrupt
    trap "kill $SERVER_PID 2>/dev/null; exit" INT TERM
    wait $SERVER_PID
}

start_server
