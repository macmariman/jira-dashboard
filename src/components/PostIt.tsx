import { useRef, useCallback } from 'react'

export interface Annotation {
  id: string
  x: number
  y: number
  text: string
}

interface PostItProps {
  annotation: Annotation
  onMove: (id: string, x: number, y: number) => void
  onChange: (id: string, text: string) => void
  onDelete: (id: string) => void
}

export function PostIt({ annotation, onMove, onChange, onDelete }: PostItProps) {
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: annotation.x,
        origY: annotation.y,
      }
    },
    [annotation.x, annotation.y],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      onMove(annotation.id, dragRef.current.origX + dx, dragRef.current.origY + dy)
    },
    [annotation.id, onMove],
  )

  const handlePointerUp = useCallback(() => {
    dragRef.current = null
  }, [])

  return (
    <div
      className="absolute z-10 w-48 animate-[postItIn_0.2s_ease-out]"
      style={{
        left: annotation.x,
        top: annotation.y,
        transform: 'rotate(-1deg)',
      }}
    >
      <div
        className="flex h-6 cursor-grab items-center justify-between rounded-t bg-amber-400 px-2 active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <span className="text-[10px] font-bold text-amber-900 select-none">NOTA</span>
        <button
          className="text-amber-900/60 hover:text-amber-900 text-xs font-bold leading-none"
          onClick={() => onDelete(annotation.id)}
        >
          x
        </button>
      </div>
      <textarea
        className="block w-full resize-none rounded-b border-0 bg-amber-100 p-2 text-xs text-amber-950 shadow-md outline-none placeholder:text-amber-400"
        rows={3}
        placeholder="Escribí una nota..."
        value={annotation.text}
        onChange={(e) => onChange(annotation.id, e.target.value)}
      />
    </div>
  )
}
