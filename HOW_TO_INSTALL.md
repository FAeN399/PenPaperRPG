# 🎮 How to Install & Run PenPaperRPG

## ⚡ Super Quick Start (30 seconds!)

### 1. Create the Installation Package

```bash
cd /home/user/PenPaperRPG
./create-release.sh
```

This creates: `release/PenPaperRPG-v0.1.0-web.zip` (136KB)

### 2. Extract and Run

**Windows:**
```cmd
1. Extract PenPaperRPG-v0.1.0-web.zip
2. Double-click start-server.bat
3. Browser opens automatically!
```

**Linux/Mac:**
```bash
unzip PenPaperRPG-v0.1.0-web.zip
cd PenPaperRPG-v0.1.0-web
./start-server.sh
# Open browser to http://localhost:8080
```

**That's it!** 🎉

---

## 📦 What You Get

The installation package includes:

✅ **Complete Application** (483KB)
- All game content (12 classes, 6 ancestries, 235 spells, etc.)
- Modern dark purple UI
- Auto-save functionality
- Character import/export

✅ **Start Scripts**
- Windows: `start-server.bat`
- Linux/Mac: `start-server.sh`
- Auto-detects available web servers

✅ **Full Documentation**
- QUICK_START.md - 30-second guide
- INSTALLATION_GUIDE.md - Complete instructions
- README.md - Project overview

✅ **Release Info**
- Version information
- Checksums (SHA256)
- System requirements

---

## 🚀 Installation Methods

### Method 1: Web Version (Recommended)

**Advantages:**
- ✅ No installation required
- ✅ Works on any OS
- ✅ Smallest download (136KB zip)
- ✅ 100% feature parity
- ✅ Easy updates

**How to use:**
```bash
# 1. Create release package
./create-release.sh

# 2. The package is created at:
release/PenPaperRPG-v0.1.0-web.zip

# 3. Share this zip file with users!
```

**Users just:**
1. Extract the zip
2. Run the start script
3. Open browser
4. Done!

---

### Method 2: Direct Development Mode

**For developers/contributors:**

```bash
# 1. Install dependencies
npm install

# 2. Run in development mode
npm run dev

# Opens at http://localhost:5173
```

---

### Method 3: Native Installers (Future)

Currently blocked due to network restrictions, but configured in `package.json`:

**Windows:**
- NSIS Installer (.exe) - Full installation wizard
- Portable (.exe) - Run without installation

**Linux:**
- AppImage - Universal Linux package
- DEB - Debian/Ubuntu package

**Mac:**
- DMG - macOS disk image (x64 + arm64)

Will be available in future releases when network access is available.

---

## 🖥️ System Requirements

### Minimum:
- **Browser:** Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **Server:** Node.js 18+ OR Python 3 OR PHP
- **RAM:** 512MB free
- **Storage:** 50MB free

### Recommended:
- **Browser:** Latest Chrome/Firefox/Edge
- **Server:** Node.js 20+
- **RAM:** 1GB free
- **Storage:** 100MB free

---

## 📖 Complete User Guide

### For End Users:

1. **Get the Package:**
   - Download `PenPaperRPG-v0.1.0-web.zip`
   - Extract to any folder

2. **Read First:**
   - Open `README-FIRST.txt` (in the package)
   - Or open `QUICK_START.md`

3. **Run the App:**
   - **Windows:** Double-click `start-server.bat`
   - **Linux/Mac:** Run `./start-server.sh`

4. **Start Creating:**
   - Browser opens to http://localhost:8080
   - Follow the step-by-step character creator
   - Characters auto-save as you work!

5. **Save Your Work:**
   - Auto-saves every second to browser
   - Manual save: File → Save Character
   - Export: File → Export as Text

### For Developers:

1. **Clone Repository:**
   ```bash
   git clone <repository-url>
   cd PenPaperRPG
   ```

2. **Install & Run:**
   ```bash
   npm install
   npm run dev
   ```

3. **Build Release:**
   ```bash
   ./create-release.sh
   ```

4. **Find Output:**
   - Package: `release/PenPaperRPG-v0.1.0-web.zip`
   - Info: `release/PenPaperRPG-v0.1.0-web-INFO.txt`
   - Checksums: `release/PenPaperRPG-v0.1.0-web.sha256`

---

## 🎯 Distribution Guide

### Sharing the App:

1. **Create Package:**
   ```bash
   ./create-release.sh
   ```

2. **Find Distributable:**
   ```
   release/PenPaperRPG-v0.1.0-web.zip (136KB)
   ```

3. **Share:**
   - Upload to file hosting
   - Send via email
   - Host on website
   - Put on USB drive

4. **Users Extract & Run:**
   - No installation needed
   - Cross-platform compatible
   - Offline capable

### What Users Need:

**Absolutely Required:**
- The zip file
- A web browser

**Probably Already Have:**
- Node.js (common on dev machines)
- OR Python 3 (pre-installed on Mac/Linux)
- OR PHP (common on web servers)

**If They Have Nothing:**
- Guide them to install Node.js: https://nodejs.org
- It's a one-time install, very simple

---

## 🔧 Troubleshooting

### "No server found" Error

**Solution:** Install Node.js
```bash
# Go to: https://nodejs.org
# Download and install
# Then run the start script again
```

### "Port 8080 already in use"

**Solution 1:** Kill the existing process
```bash
# Linux/Mac:
lsof -ti:8080 | xargs kill -9

# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Solution 2:** Use a different port
Edit the start script and change `8080` to `3000` (or any free port)

### Browser Doesn't Open

**Solution:** Manually open:
```
http://localhost:8080
```

### Characters Not Saving

**Solution:**
- Enable localStorage in browser settings
- Try a different browser
- Use File → Save Character for manual backup

---

## 🚢 Deployment Options

### Option 1: Local Files (Current)
- Users run locally
- Maximum privacy
- Offline capable
- No server costs

### Option 2: Web Hosting (Future)
- Deploy `dist/` folder to any static host
- Examples: GitHub Pages, Netlify, Vercel
- Users access via URL
- No installation needed

### Option 3: Desktop App (Future)
- Native installers when network allows
- Better OS integration
- System tray, notifications

---

## 📊 Package Details

### Release Package Contains:

```
PenPaperRPG-v0.1.0-web/
├── dist/                          # Application (483KB)
│   ├── assets/
│   │   ├── index-*.css           # Styles (20KB)
│   │   └── index-*.js            # App bundle (464KB)
│   └── index.html                # Entry point
├── start-server.sh               # Linux/Mac script
├── start-server.bat              # Windows script
├── QUICK_START.md                # Quick guide
├── INSTALLATION_GUIDE.md         # Complete guide
├── README.md                     # Project info
├── README-FIRST.txt              # First-time users
├── LICENSE                       # MIT License
└── package.json                  # Metadata
```

### File Sizes:
- **Zip Archive:** 136KB
- **Extracted:** 517KB
- **Application:** 483KB
- **Documentation:** 27KB
- **Scripts:** 7KB

---

## ✨ Features Included

**Character Creation:**
- ✅ 12 Core Classes
- ✅ 6 Ancestries with 32 Heritages
- ✅ 30 Backgrounds
- ✅ Ability Score Builder
- ✅ Skills System (17 skills)
- ✅ Feats System (141 feats)
- ✅ Spells System (235 spells, levels 0-3)
- ✅ Equipment System (59 weapons, 16 armor, 55 items)

**User Experience:**
- ✅ Auto-save (every 1 second)
- ✅ Save/Load to files
- ✅ Export to text
- ✅ Character Sheet view
- ✅ Dark purple theme
- ✅ Toast notifications
- ✅ Error boundaries
- ✅ Loading states
- ✅ Confirmation dialogs

**Playable Content:**
- ✅ Levels 1-5 (fully supported)
- ✅ All core ancestries
- ✅ All core classes
- ✅ Comprehensive spell lists
- ✅ Complete equipment catalogs

---

## 🎓 Tutorial for First-Time Users

### Step 1: Extract the Package
- Right-click `PenPaperRPG-v0.1.0-web.zip`
- Choose "Extract All" (Windows) or double-click (Mac)

### Step 2: Open the Folder
- Navigate to extracted folder
- You'll see several files and a `dist` folder

### Step 3: Run the Start Script
- **Windows:** Double-click `start-server.bat`
- **Mac/Linux:** Right-click `start-server.sh` → "Open With" → "Terminal"

### Step 4: Browser Opens
- Should open automatically
- If not, manually go to: http://localhost:8080

### Step 5: Create Character!
- Click "Create New Character"
- Follow the 9-step wizard
- Everything saves automatically!

---

## 🆘 Getting Help

### Documentation:
- **Quick Start:** See `QUICK_START.md`
- **Full Guide:** See `INSTALLATION_GUIDE.md`
- **Project Info:** See `README.md`
- **Code Quality:** See `CODE_QUALITY_IMPROVEMENTS.md`

### Support:
- **Issues:** Report on GitHub
- **Questions:** Check documentation first
- **Contributions:** Pull requests welcome!

---

## 🎉 Success!

You now have a complete, distributable version of PenPaperRPG that:
- ✅ Requires no installation
- ✅ Works on any platform
- ✅ Includes all features
- ✅ Is ready to share
- ✅ Has professional documentation

**Just run:**
```bash
./create-release.sh
```

**Then share:**
```
release/PenPaperRPG-v0.1.0-web.zip
```

**Users will love it!** 🎲✨

---

**Version:** 0.1.0
**License:** MIT
**Built with:** React + TypeScript + Vite + Tailwind CSS
**Pathfinder 2e Content:** Under ORC License
