import { useContext } from 'react'
import { TutorialContext } from '@/context/tutorial-context'

export function useTutorial() {
  const context = useContext(TutorialContext)
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider')
  }
  return context
}
