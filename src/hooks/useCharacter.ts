import { useContext } from 'react'
import { CharacterContext } from '@/context/CharacterContext'

export function useCharacter() {
  const context = useContext(CharacterContext)

  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider')
  }

  return context
}
