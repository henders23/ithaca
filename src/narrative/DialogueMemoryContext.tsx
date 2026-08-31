import { createContext, useContext, type ReactNode } from 'react'
import type { DialogueMomentChoice } from '../slice/content.js'

export interface DialogueMomentSelection {
  sceneId: string
  choice: DialogueMomentChoice
}

const DialogueMemoryContext = createContext<(selection: DialogueMomentSelection) => void>(() => undefined)

export function DialogueMemoryProvider({ onRecord, children }: { onRecord: (selection: DialogueMomentSelection) => void; children: ReactNode }) {
  return <DialogueMemoryContext.Provider value={onRecord}>{children}</DialogueMemoryContext.Provider>
}

export function useDialogueMemory() {
  return useContext(DialogueMemoryContext)
}
