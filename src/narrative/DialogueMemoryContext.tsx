import { createContext, useContext, type ReactNode } from 'react'
import type { DialogueMomentChoice } from '../slice/content.js'
import type { DialogueMemoryRecord } from '../state/types.js'

export interface DialogueMomentSelection {
  sceneId: string
  momentId: string
  choice: DialogueMomentChoice
}

const DialogueMemoryContext = createContext<{
  record: (selection: DialogueMomentSelection) => void
  memories: readonly DialogueMemoryRecord[]
  suspended: boolean
}>({ record: () => undefined, memories: [], suspended: false })

export function DialogueMemoryProvider({ onRecord, memories = [], suspended = false, children }: { onRecord: (selection: DialogueMomentSelection) => void; memories?: readonly DialogueMemoryRecord[]; suspended?: boolean; children: ReactNode }) {
  return <DialogueMemoryContext.Provider value={{ record: onRecord, memories, suspended }}>{children}</DialogueMemoryContext.Provider>
}

export function useDialogueMemory() {
  return useContext(DialogueMemoryContext)
}
