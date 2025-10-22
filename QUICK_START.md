# PenPaperRPG - Quick Start Guide

## 🚀 Get Started in 30 Seconds

### Windows
1. Double-click `start-server.bat`
2. Browser will open automatically
3. Start creating your character!

### Linux / Mac
1. Open terminal in this folder
2. Run `./start-server.sh`
3. Open browser to http://localhost:8080
4. Start creating your character!

---

## 📋 What's Included

This package contains the **complete PenPaperRPG application**:

### Game Content
- ✅ **12 Core Classes** - Alchemist, Barbarian, Bard, Champion, Cleric, Druid, Fighter, Monk, Ranger, Rogue, Sorcerer, Wizard
- ✅ **6 Ancestries** - Human, Elf, Dwarf, Gnome, Halfling, Goblin
- ✅ **32 Heritages** - Multiple options for each ancestry
- ✅ **30 Backgrounds** - From Acrobat to Sailor
- ✅ **235 Spells** - Cantrips through Level 3 across all traditions
- ✅ **59 Weapons** - Simple, Martial, and Ancestry-specific
- ✅ **16 Armor Types** - Complete protection options
- ✅ **55 Items** - Including alchemical items for Alchemists
- ✅ **141 Feats** - Ancestry, General, Skill, and Class feats

### Features
- ✅ **Auto-Save** - Never lose your progress
- ✅ **Save/Load** - Export and import characters
- ✅ **Character Sheet** - Beautiful display of your completed character
- ✅ **Dark Theme** - Easy on the eyes purple theme
- ✅ **Step-by-Step** - Guided character creation process

---

## 🎮 First Time Setup

### Minimum Requirements
- **Any modern browser** (Chrome, Firefox, Edge, Safari)
- **One of:** Node.js, Python 3, or PHP (for running local server)
- **50MB** free disk space

### If Scripts Don't Work

**Option 1: Install Node.js (Recommended)**
1. Download from https://nodejs.org
2. Install with default settings
3. Run the start script again

**Option 2: Use Python (Usually Pre-installed)**
```bash
python3 -m http.server 8080 --directory dist
```
Then open browser to http://localhost:8080

**Option 3: Manual with Any Server**
Serve the `dist` folder on any web server on port 8080 or any port you prefer.

---

## 💡 Tips

### Saving Characters
- **Auto-Save:** Happens automatically every second
- **Manual Save:** Click File → Save Character (downloads .json file)
- **Load:** Click File → Load Character (upload your .json file)
- **Export:** Click File → Export as Text (for printing)

### Switching Views
- Click "View Character Sheet" button to see completed character
- Click "Back to Creator" to continue editing

### Starting Over
- Click File → New Character
- Or refresh the page and start fresh

---

## 🐛 Problems?

### "Page not loading"
- Make sure the server script is running
- Check you're going to http://localhost:8080
- Try a different port: modify the script to use 3000 instead of 8080

### "No server found"
- Install Node.js from https://nodejs.org (easiest)
- Or install Python 3: https://www.python.org

### "Character not saving"
- Check browser allows localStorage
- Try a different browser
- Use File → Save Character for manual backup

---

## 📚 Full Documentation

For detailed information, see:
- **INSTALLATION_GUIDE.md** - Complete installation instructions
- **README.md** - Full project documentation
- **CODE_QUALITY_IMPROVEMENTS.md** - Latest improvements

---

## 🎲 Enjoy Creating Characters!

**Current Version:** 0.1.0
**Playable Levels:** 1-5 (fully supported)
**License:** MIT

Created with ❤️ for the Pathfinder 2e community

---

## Need Help?

- **Issues:** Report bugs on GitHub
- **Questions:** Check INSTALLATION_GUIDE.md
- **Updates:** Follow the GitHub repository

**Have fun adventuring!** 🗡️✨
