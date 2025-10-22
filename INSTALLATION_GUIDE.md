# PenPaperRPG - Installation Guide

## Quick Start (3 Methods)

### Method 1: Web Version (Recommended - No Installation Required!)

The easiest way to use PenPaperRPG is to run it as a web application:

```bash
# 1. Extract the release package
unzip PenPaperRPG-v0.1.0-web.zip

# 2. Navigate to the folder
cd PenPaperRPG

# 3. Serve the application (choose one):

# Option A: Using Python (usually pre-installed)
python3 -m http.server 8080 --directory dist

# Option B: Using Node.js serve package
npx serve dist -p 8080

# Option C: Using PHP (if installed)
php -S localhost:8080 -t dist

# 4. Open in your browser
# Navigate to: http://localhost:8080
```

**That's it!** No installation, no dependencies, just works.

---

### Method 2: Standalone Desktop App (For Developers)

If you want to run it as a desktop application:

```bash
# 1. Ensure Node.js is installed (v18 or higher)
node --version

# 2. Clone or download the source code
cd PenPaperRPG

# 3. Install dependencies
npm install

# 4. Run in development mode
npm run dev

# Or build and run production version
npm run build
npm run preview
```

---

### Method 3: Native Installer (Future Release)

Native installers (.exe for Windows, .deb/.AppImage for Linux, .dmg for Mac) require network access to build. Due to current network restrictions, these will be provided in a future release.

**Workaround:** Use Method 1 (Web Version) which works identically to a native app but runs in your browser.

---

## What You Get

### Web Version (Method 1)
✅ **Pros:**
- No installation required
- Works on any OS (Windows, Mac, Linux)
- Runs in any modern browser
- Automatic updates (just replace dist folder)
- Small download size (~500KB)
- All features included:
  - Auto-save to browser localStorage
  - Save/Load characters to files
  - Export to text
  - Full character creator
  - Character sheet view

❌ **Cons:**
- Requires a browser
- Needs local server to run (simple one-liner command)

### Desktop Version (Method 2)
✅ **Pros:**
- Native desktop application
- Can run without browser
- System tray integration (future)
- Better OS integration

❌ **Cons:**
- Requires Node.js installed
- Larger download size (~150MB with dependencies)
- Manual updates

---

## System Requirements

### Minimum:
- **OS:** Windows 10/11, macOS 10.14+, Linux (any modern distro)
- **Browser:** Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **RAM:** 512MB free
- **Storage:** 50MB free space
- **For Method 2:** Node.js 18+ and npm

### Recommended:
- **OS:** Windows 11, macOS 12+, Ubuntu 22.04+
- **Browser:** Latest version of Chrome/Firefox/Edge
- **RAM:** 1GB free
- **Storage:** 100MB free space

---

## Detailed Installation Steps

### Windows

#### Method 1: Web Version
1. Download `PenPaperRPG-v0.1.0-web.zip`
2. Extract to a folder (e.g., `C:\PenPaperRPG`)
3. Open Command Prompt or PowerShell in that folder
4. Run:
   ```powershell
   npx serve dist -p 8080
   ```
   Or if you have Python installed:
   ```powershell
   python -m http.server 8080 --directory dist
   ```
5. Open browser to `http://localhost:8080`

#### Creating a Desktop Shortcut (Optional)
1. Right-click desktop → New → Shortcut
2. Location: `C:\Program Files\Google\Chrome\Application\chrome.exe --app=http://localhost:8080`
3. Name: `PenPaperRPG`
4. You'll need to start the server first, then launch this shortcut

---

### Linux

#### Method 1: Web Version
```bash
# 1. Extract the package
unzip PenPaperRPG-v0.1.0-web.zip
cd PenPaperRPG

# 2. Install a simple HTTP server (if not already installed)
# Option A: Using npm (if Node.js installed)
npm install -g serve
serve dist -p 8080

# Option B: Using Python (usually pre-installed)
python3 -m http.server 8080 --directory dist

# Option C: Using PHP
php -S localhost:8080 -t dist

# 3. Open browser
xdg-open http://localhost:8080

# Or use any browser and navigate to http://localhost:8080
```

#### Creating a .desktop File (Optional)
```bash
# Create launcher
cat > ~/.local/share/applications/penpaperrpg.desktop << 'EOF'
[Desktop Entry]
Type=Application
Name=PenPaperRPG
Comment=Pathfinder 2e Character Creator
Exec=xdg-open http://localhost:8080
Icon=utilities-terminal
Terminal=false
Categories=Game;RolePlaying;
EOF

# Make executable
chmod +x ~/.local/share/applications/penpaperrpg.desktop
```

---

### macOS

#### Method 1: Web Version
```bash
# 1. Extract the package
unzip PenPaperRPG-v0.1.0-web.zip
cd PenPaperRPG

# 2. Start the server
python3 -m http.server 8080 --directory dist

# Or if you have Node.js:
npx serve dist -p 8080

# 3. Open in browser
open http://localhost:8080
```

---

## Creating a Portable Version

Want to run PenPaperRPG without internet access? Here's how:

### Create Portable Package

```bash
# 1. Copy these files to a USB drive or folder:
- dist/ (entire folder)
- start-server.sh (Linux/Mac)
- start-server.bat (Windows)

# 2. Create start-server.sh (Linux/Mac):
cat > start-server.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
echo "Starting PenPaperRPG..."
echo "Open your browser to: http://localhost:8080"
python3 -m http.server 8080 --directory dist
EOF
chmod +x start-server.sh

# 3. Create start-server.bat (Windows):
cat > start-server.bat << 'EOF'
@echo off
echo Starting PenPaperRPG...
echo Open your browser to: http://localhost:8080
cd /d "%~dp0"
python -m http.server 8080 --directory dist
pause
EOF

# 4. Double-click the appropriate script to start
```

---

## Troubleshooting

### "Command not found: npx"
**Solution:** Install Node.js from https://nodejs.org

### "Command not found: python3"
**Solution:**
- **Windows:** Install Python from https://python.org
- **Linux:** Run `sudo apt install python3` (Ubuntu/Debian) or `sudo yum install python3` (CentOS/Fedora)
- **macOS:** Python 3 should be pre-installed. Try `python --version`

### "Port 8080 is already in use"
**Solution:** Use a different port:
```bash
# Change 8080 to any other number (e.g., 3000, 5000, 8888)
python3 -m http.server 3000 --directory dist
```

### Cannot access from another device on network
**Solution:** Find your local IP and use it:
```bash
# Find your IP
# Linux/Mac:
ip addr show | grep "inet "
# Windows:
ipconfig

# Then access from another device using:
http://YOUR_IP_ADDRESS:8080
```

### Characters not saving
**Solution:**
- Check browser localStorage is enabled
- Try a different browser
- Clear browser cache and reload
- Use the File → Save Character feature for manual backups

### "Failed to load module" or blank page
**Solution:**
- Make sure you're serving from the `dist` directory
- Check browser console (F12) for errors
- Try running `npm run build` again
- Clear browser cache (Ctrl+Shift+Delete)

---

## Uninstallation

### Web Version
Simply delete the PenPaperRPG folder. No traces left on your system.

### Desktop Version (Method 2)
```bash
cd PenPaperRPG
rm -rf node_modules
cd ..
rm -rf PenPaperRPG
```

### Clear Saved Data
Characters are saved in browser localStorage. To clear:
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Find "Local Storage" → http://localhost:8080
4. Delete the `penpaperrpg-character-autosave` key

Or use the app's File → New Character feature.

---

## Advanced: Running as a Background Service

### Linux (systemd)
```bash
# Create service file
sudo nano /etc/systemd/system/penpaperrpg.service

# Add content:
[Unit]
Description=PenPaperRPG Character Creator
After=network.target

[Service]
Type=simple
User=YOUR_USERNAME
WorkingDirectory=/path/to/PenPaperRPG
ExecStart=/usr/bin/python3 -m http.server 8080 --directory dist
Restart=on-failure

[Install]
WantedBy=multi-user.target

# Enable and start
sudo systemctl enable penpaperrpg
sudo systemctl start penpaperrpg
```

### Windows (as Scheduled Task)
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: At log on
4. Action: Start a program
5. Program: `python`
6. Arguments: `-m http.server 8080 --directory C:\Path\To\PenPaperRPG\dist`

---

## Getting Help

- **Issues:** https://github.com/FAeN399/PenPaperRPG/issues
- **Documentation:** See README.md
- **Code Quality Report:** See CODE_QUALITY_IMPROVEMENTS.md

---

## Why No Native Installer (Yet)?

Creating true native installers (.exe, .deb, .dmg) requires:
1. Downloading Electron runtime (~150MB)
2. Network access to GitHub CDN
3. Code signing certificates (for trusted installers)

Due to current network restrictions, we can't download Electron during build. However:

**The web version is identical in functionality!** It includes:
- ✅ All 12 classes, 6 ancestries, 235 spells
- ✅ Auto-save to localStorage
- ✅ Save/Load characters to files
- ✅ Export to text format
- ✅ Full character sheet view
- ✅ Dark purple themed UI
- ✅ Toast notifications
- ✅ Error handling

The only difference is it runs in a browser instead of a standalone window.

---

## Future Releases

Planned features for future versions:
- ✅ Native installers (.exe, .deb, .AppImage, .dmg)
- ✅ Auto-updater
- ✅ System tray integration
- ✅ Multi-character management
- ✅ Level advancement (6-10)
- ✅ PDF export
- ✅ Character templates
- ✅ Homebrew content support

**Current Version:** 0.1.0 - Fully playable for levels 1-5!
