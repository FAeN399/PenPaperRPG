# PenPaperRPG - Built Application

This branch contains the **complete production build** of the PenPaperRPG Pathfinder 2e Character Creator.

## Build Information

**Build Date:** October 22, 2025
**Build Tool:** Vite 5.4.21 + TypeScript + Electron Builder
**Source Branch:** `claude/read-file-content-011CUNPHS5R6dEpM3QkGko9N`

## Build Artifacts

### Web Application (`dist/`)
- **Size:** ~466 KB
- **Files:**
  - `index.html` - Main HTML entry point
  - `assets/index-B0J7BnPM.css` - Compiled styles (19.6 KB)
  - `assets/index-CZKO7o91.js` - Compiled application bundle (447.5 KB)

### Electron Application (`dist-electron/`)
- **Size:** ~5.5 KB
- **Files:**
  - `main.js` - Electron main process
  - `preload.js` - Electron preload script

## Application Features

### Complete Character Creation System
- **12 Core Classes:** Alchemist, Barbarian, Bard, Champion, Cleric, Druid, Fighter, Monk, Ranger, Rogue, Sorcerer, Wizard
- **6 Ancestries:** Human, Elf, Dwarf, Gnome, Halfling, Goblin
- **32 Heritages:** 4-6 options per ancestry
- **30 Backgrounds:** Complete Core Rulebook coverage
- **Ability Score Builder:** Point buy and array systems
- **Skills System:** All 17 core skills with proficiency tracking
- **Feats System:** 141 feats (ancestry, general, skill, class)
- **Spells System:** 235 spells across 4 traditions (levels 0-3)
- **Equipment System:** 59 weapons, 16 armor types, 55 items

### User Interface
- **Dark Purple Theme:** Modern, professional design
- **Step-by-step Wizard:** Guided character creation
- **Character Sheet View:** Complete character display
- **File Operations:** Save/Load characters (JSON), Export to text

### Data Content

**Playable Levels:** 1-5 (fully supported)

**Content Counts:**
- Classes: 12
- Ancestries: 6
- Heritages: 32
- Backgrounds: 30
- Skills: 17
- Feats: 141
- Spells: 235 (Cantrips + Levels 1-3)
- Weapons: 59
- Armor: 16
- Items: 55

## Running the Application

### As Web App
1. Serve the `dist/` directory with any static file server
2. Example: `npx serve dist`
3. Open in browser

### As Electron App
1. Ensure Electron is installed: `npm install electron`
2. Run: `electron .`
3. The app will load using the built files in `dist/`

## Build Process

The application was built using:
```bash
npm run build
```

Which executes:
1. **TypeScript Compilation:** `tsc` - Type-checks and compiles TypeScript
2. **Vite Build:** `vite build` - Bundles the React application
3. **Electron Build:** Compiles Electron main/preload scripts

## Build Statistics

**TypeScript:** ✅ 0 errors
**Vite Bundle:** 76 modules transformed
**Output Size:** 447.51 KB (gzipped: 112.50 KB)
**CSS Size:** 19.63 KB (gzipped: 4.07 KB)

## Technical Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 5.4.21
- **Desktop:** Electron 28.3.3
- **Styling:** Tailwind CSS 3.4
- **State Management:** React Context API

## License

This application uses the Pathfinder Second Edition system under the ORC License.

## Notes

This branch is automatically generated and contains only the built artifacts. For source code and development, see the main development branches.
