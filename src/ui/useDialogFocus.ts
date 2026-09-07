import { useEffect, useRef } from 'react'

/** Keep keyboard players with a blocking scene and return focus when it closes. */
export function useDialogFocus<T extends HTMLElement = HTMLDivElement>(open: boolean, revision: unknown = open) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!open || !ref.current) return
    const dialog = ref.current
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const buttons = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input, select, textarea, [tabindex="0"]'))
    ;(buttons()[0] ?? dialog).focus()
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = buttons()
      const index = items.indexOf(document.activeElement as HTMLElement)
      if (index < 0 || (event.shiftKey && index === 0) || (!event.shiftKey && index === items.length - 1)) {
        event.preventDefault()
        ;(items[event.shiftKey ? items.length - 1 : 0] ?? dialog).focus()
      }
    }
    dialog.addEventListener('keydown', trap)
    return () => { dialog.removeEventListener('keydown', trap); if (previous?.isConnected) previous.focus() }
  }, [open, revision])
  return ref
}
