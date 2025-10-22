import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { CharacterProvider } from './context/CharacterContext'
import CharacterCreator from './components/CharacterCreator'
import CharacterSheet from './components/CharacterSheet'
import Button from './components/shared/Button'

type AppView = 'landing' | 'creator' | 'sheet'

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('landing')

  if (currentView === 'creator') {
    return <CharacterCreator onViewSheet={() => setCurrentView('sheet')} />
  }

  if (currentView === 'sheet') {
    return (
      <div className="min-h-screen flex flex-col bg-pf-bg">
        <header className="bg-pf-bg-card border-b border-pf-border px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-pf-accent">PenPaperRPG</h1>
            <p className="text-sm text-pf-text-muted">Character Sheet</p>
          </div>
          <Button onClick={() => setCurrentView('creator')}>
            Back to Creator
          </Button>
        </header>
        <CharacterSheet />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-pf-bg-card border-b border-pf-border px-6 py-4">
        <h1 className="text-pf-accent">PenPaperRPG</h1>
        <p className="text-sm text-pf-text-muted">Pathfinder 2e Character Creator</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="card text-center py-12">
            <h2 className="text-pf-accent mb-4">Welcome to PenPaperRPG</h2>
            <p className="text-pf-text-muted mb-6">
              A comprehensive character creator for Pathfinder Second Edition
            </p>
            <p className="text-sm text-pf-text-muted mb-8">
              Phase 5: Character Creation Steps - Complete
            </p>
            <Button onClick={() => setCurrentView('creator')}>
              Create New Character
            </Button>
          </div>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="card">
              <h3 className="text-pf-accent mb-2">Deep Character Creation</h3>
              <p className="text-sm text-pf-text-muted">
                Full support for ancestries, backgrounds, classes, and feats
              </p>
            </div>
            <div className="card">
              <h3 className="text-pf-accent mb-2">Modern Interface</h3>
              <p className="text-sm text-pf-text-muted">
                Clean, intuitive UI with progressive disclosure
              </p>
            </div>
            <div className="card">
              <h3 className="text-pf-accent mb-2">Local Storage</h3>
              <p className="text-sm text-pf-text-muted">
                Save and manage characters on your computer
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-pf-bg-card border-t border-pf-border px-6 py-4 text-center text-sm text-pf-text-muted">
        <p>
          This application uses the Pathfinder Second Edition system under the ORC License
        </p>
        <p className="mt-1">
          Pathfinder and associated marks are trademarks of Paizo Inc.
        </p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <CharacterProvider>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#2d1b4e',
            color: '#f3f4f6',
            border: '1px solid #4c1d95',
          },
          success: {
            iconTheme: {
              primary: '#8b5cf6',
              secondary: '#f3f4f6',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f3f4f6',
            },
          },
        }}
      />
    </CharacterProvider>
  )
}

export default App
