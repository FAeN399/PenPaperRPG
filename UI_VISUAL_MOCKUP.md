# PenPaperRPG - Visual UI Mockup

## Welcome Screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PenPaperRPG                                    💾 Save    ❓ Help       │
│ Pathfinder 2e Character Creator                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                                                                          │
│                    ┌──────────────────────────────────┐                 │
│                    │                                  │                 │
│                    │  Welcome to PenPaperRPG          │                 │
│                    │                                  │                 │
│                    │  A comprehensive character       │                 │
│                    │  creator for Pathfinder 2e       │                 │
│                    │                                  │                 │
│                    │  Phase 2: Core UI Framework      │                 │
│                    │         - Complete               │                 │
│                    │                                  │                 │
│                    │  ┌────────────────────────────┐  │                 │
│                    │  │ Create New Character       │  │                 │
│                    │  └────────────────────────────┘  │                 │
│                    └──────────────────────────────────┘                 │
│                                                                          │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐       │
│   │ Deep Character  │  │ Modern          │  │ Local Storage   │       │
│   │ Creation        │  │ Interface       │  │                 │       │
│   │                 │  │                 │  │ Save characters │       │
│   │ Full support    │  │ Clean, intuitive│  │ on your         │       │
│   │ for ancestries, │  │ UI with         │  │ computer        │       │
│   │ backgrounds,    │  │ progressive     │  │                 │       │
│   │ classes, feats  │  │ disclosure      │  │                 │       │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘       │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│  This application uses the Pathfinder Second Edition system under       │
│  the ORC License. Pathfinder and associated marks are trademarks        │
│  of Paizo Inc.                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## Character Creator - Full Layout

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PenPaperRPG                   Unnamed Character                   💾 Save    ❓ Help   │
│ Pathfinder 2e Character Creator    Step 1 of 10                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ①────②────③────④────⑤────⑥────⑦────⑧────⑨────⑩                                      │
│  Character│Background│Class│Abilities│Skills│Feats│Spells│Equipment│Review            │
│  Basics   │          │     │         │      │     │      │         │                  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                │                                                                        │
│ Character      │                    Character Basics                                   │
│ Stats          │                Enter your character's basic information               │
│                │                                                                        │
│ Name:          │  ┌────────────────────────────────────────────────────────────────┐  │
│ Unnamed        │  │                                                                │  │
│ Character      │  │        Enter your character's basic information                │  │
│                │  │                                                                │  │
│ Level: 1       │  │        Step content will be implemented in Phase 5             │  │
│                │  │                                                                │  │
│ Ancestry:      │  │                                                                │  │
│ -              │  └────────────────────────────────────────────────────────────────┘  │
│                │                                                                        │
│ Background:    │                                                                        │
│ -              │                                                                        │
│                │                                                                        │
│ Class:         │                                                                        │
│ -              │                                                                        │
│                │                                                                        │
│ Ability        │                                                                        │
│ Scores         │                                                                        │
│                │                                                                        │
│ STR  DEX       │                                                                        │
│ +0    +0       │                                                                        │
│ 10    10       │                                                                        │
│                │                                                                        │
│ CON  INT       │                                                                        │
│ +0    +0       │                                                                        │
│ 10    10       │                                                                        │
│                │                                                                        │
│ WIS  CHA       │                                                                        │
│ +0    +0       │                                                                        │
│ 10    10       │                                                                        │
│                │                                                                        │
│ Combat         │                                                                        │
│                │                                                                        │
│ HP: 0 / 0      │                                                                        │
│ AC: 10         │                                                                        │
│ Class DC: 10   │                                                                        │
│ Perception: +0 │                                                                        │
│ Speed: 25 ft   │                                                                        │
│                │                                                                        │
│ Saving Throws  │                                                                        │
│                │                                                                        │
│ Fortitude: +0  │                                                                        │
│ Reflex: +0     │                                                                        │
│ Will: +0       │                                                                        │
│                │                                                                        │
├────────────────┴────────────────────────────────────────────────────────────────────────┤
│                         💾 Save Draft                       Next →                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

## Step Indicator Detail (Active Step 3)

```
①───✓───✓───③───④───⑤───⑥───⑦───⑧───⑨
│   │   │   │   │   │   │   │   │   │
Basics│Background│Class│Abilities│Skills│Feats│Spells│Equip│Review
(done)(done)(active)(pending)...
```

## Color Scheme (Dark Theme)

- **Background Dark**: `#1a1a1a` - Main app background
- **Background Card**: `#2d2d2d` - Card/panel backgrounds
- **Primary Red**: `#5e0000` - Primary buttons (hover)
- **Secondary Red**: `#8b0000` - Primary buttons (default)
- **Accent Gold**: `#daa520` - Headers, highlights, selections
- **Text**: `#e0e0e0` - Main text
- **Text Muted**: `#a0a0a0` - Secondary text

## Interactive Elements

### Buttons
```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│   Primary Button    │  │  Secondary Button   │  │    Ghost Button     │
│ (Red/Dark Burgundy) │  │       (Gray)        │  │   (Transparent)     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

### Cards (Hoverable/Selectable)
```
┌─────────────────────────────┐
│                             │  ← Default (gray border)
│     Card Content            │
│                             │
└─────────────────────────────┘

┌═════════════════════════════┐
│                             │  ← Selected (gold border, thicker)
│     Card Content            │
│                             │
└═════════════════════════════┘
```

### Form Inputs
```
Label *
┌─────────────────────────────────────┐
│ User input here...                  │
└─────────────────────────────────────┘
```

## Navigation Flow

1. **Welcome Screen** → Click "Create New Character"
2. **Character Creator Opens** with Step 1 (Basics)
3. Use **Next →** button to advance through steps
4. Use **← Back** button to go back
5. Click on **step numbers** in indicator to jump to completed steps
6. **💾 Save Draft** available at all times
7. Final step shows **✓ Finish** button

## Responsive Behavior

- Sidebar: Fixed 320px width (80rem)
- Main content: Scrollable, max-width 1024px, centered
- Step indicator: Hides labels on small screens, shows only numbers
- Cards: Stack vertically on mobile

---

## How to Test Locally

If you have a development environment, run:

```bash
npm run dev
```

This will:
1. Start Vite dev server on http://localhost:5173
2. Launch Electron window automatically
3. Open DevTools for debugging
4. Enable hot-reload for instant updates
