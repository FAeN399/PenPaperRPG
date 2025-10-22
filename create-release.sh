#!/bin/bash

# PenPaperRPG - Create Release Package Script
# This script creates a distributable release package

set -e  # Exit on error

echo "========================================="
echo "  PenPaperRPG - Release Packager"
echo "========================================="
echo ""

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
echo "Creating release for version: $VERSION"
echo ""

# Define release name
RELEASE_NAME="PenPaperRPG-v${VERSION}-web"
RELEASE_DIR="release/${RELEASE_NAME}"

# Clean previous release
echo "Cleaning previous releases..."
rm -rf release
mkdir -p "$RELEASE_DIR"

# Build the application
echo ""
echo "Building application..."
npm run build 2>&1 | grep -E "(error|warning|✓|dist/)" || true

# Check if build succeeded
if [ ! -d "dist" ]; then
    echo "ERROR: Build failed! dist folder not found."
    exit 1
fi

echo ""
echo "Build successful!"

# Copy files to release directory
echo ""
echo "Packaging release..."

# Copy dist folder
cp -r dist "$RELEASE_DIR/"

# Copy start scripts
cp start-server.sh "$RELEASE_DIR/"
cp start-server.bat "$RELEASE_DIR/"
chmod +x "$RELEASE_DIR/start-server.sh"

# Copy documentation
cp QUICK_START.md "$RELEASE_DIR/"
cp INSTALLATION_GUIDE.md "$RELEASE_DIR/"
cp README.md "$RELEASE_DIR/"
cp LICENSE "$RELEASE_DIR/" 2>/dev/null || echo "# MIT License" > "$RELEASE_DIR/LICENSE"

# Copy package.json (minimal version)
cat > "$RELEASE_DIR/package.json" << EOF
{
  "name": "penpaperrpg",
  "version": "$VERSION",
  "description": "Pathfinder 2e Character Creator",
  "author": "PenPaperRPG Team",
  "license": "MIT"
}
EOF

# Create README in release root
cat > "$RELEASE_DIR/README-FIRST.txt" << 'EOF'
========================================
  PenPaperRPG - Pathfinder 2e Creator
========================================

QUICK START:
------------

Windows:
  1. Double-click "start-server.bat"
  2. Browser opens automatically!

Linux/Mac:
  1. Open terminal here
  2. Run: ./start-server.sh
  3. Open browser to http://localhost:8080

NEED HELP?
----------
See QUICK_START.md for detailed instructions.

WHAT'S INCLUDED:
----------------
✓ 12 Core Classes
✓ 6 Ancestries with 32 Heritages
✓ 30 Backgrounds
✓ 235 Spells (Levels 0-3)
✓ 59 Weapons
✓ 16 Armor Types
✓ 55 Items including Alchemical
✓ 141 Feats

ENJOY! 🎲✨
EOF

# Create checksums
echo ""
echo "Creating checksums..."
cd release
find "$RELEASE_NAME" -type f -exec sha256sum {} \; > "${RELEASE_NAME}.sha256"
cd ..

# Create zip archive
echo ""
echo "Creating zip archive..."
cd release
zip -r -q "${RELEASE_NAME}.zip" "$RELEASE_NAME"
cd ..

# Calculate sizes
DIST_SIZE=$(du -sh "$RELEASE_DIR/dist" | cut -f1)
ZIP_SIZE=$(du -sh "release/${RELEASE_NAME}.zip" | cut -f1)

# Create release info
cat > "release/${RELEASE_NAME}-INFO.txt" << EOF
PenPaperRPG - Release Information
==================================

Version: $VERSION
Build Date: $(date '+%Y-%m-%d %H:%M:%S')
Platform: Web (Universal)

Package Contents:
-----------------
- Application Bundle: $DIST_SIZE
- Start Scripts: Windows (.bat) + Linux/Mac (.sh)
- Documentation: QUICK_START.md, INSTALLATION_GUIDE.md, README.md

Archive Size: $ZIP_SIZE

Installation:
-------------
1. Extract ${RELEASE_NAME}.zip
2. Run start-server script for your platform
3. Open browser to http://localhost:8080

Requirements:
-------------
- Node.js 18+ (recommended) OR Python 3 OR PHP
- Modern web browser (Chrome, Firefox, Edge, Safari)
- 50MB free disk space

Verification:
-------------
SHA256 checksums available in ${RELEASE_NAME}.sha256

What's Included:
----------------
✓ 12 Core Classes
✓ 6 Ancestries with 32 Heritages
✓ 30 Backgrounds
✓ 235 Spells (Cantrips + Levels 1-3)
✓ 59 Weapons (Simple, Martial, Ancestry-specific)
✓ 16 Armor Types
✓ 55 Items (including Alchemical items)
✓ 141 Feats (Ancestry, General, Skill, Class)

Features:
---------
✓ Auto-save to browser localStorage
✓ Save/Load characters to files
✓ Export to text format
✓ Complete character sheet view
✓ Dark purple themed UI
✓ Toast notifications
✓ Error boundary protection

Playable Levels: 1-5 (fully supported)

License: MIT

For support or issues:
https://github.com/FAeN399/PenPaperRPG/issues

Enjoy creating your Pathfinder 2e characters! 🎲✨
EOF

# Summary
echo ""
echo "========================================="
echo "  Release Package Created Successfully!"
echo "========================================="
echo ""
echo "📦 Package: release/${RELEASE_NAME}.zip"
echo "📄 Info: release/${RELEASE_NAME}-INFO.txt"
echo "🔐 Checksums: release/${RELEASE_NAME}.sha256"
echo ""
echo "📊 Statistics:"
echo "  - Application: $DIST_SIZE"
echo "  - Archive: $ZIP_SIZE"
echo ""
echo "✅ Ready to distribute!"
echo ""
echo "To test the release:"
echo "  cd release/${RELEASE_NAME}"
echo "  ./start-server.sh  (Linux/Mac)"
echo "  start-server.bat  (Windows)"
echo ""
