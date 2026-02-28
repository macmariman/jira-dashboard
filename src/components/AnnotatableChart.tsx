import { useState, useCallback, type ReactNode } from 'react'
import { PostIt, type Annotation } from './PostIt'

interface AnnotatableChartProps {
  chartId: string
  children: ReactNode
}

function loadNotes(chartId: string): Annotation[] {
  try {
    const raw = localStorage.getItem(`jirajira-notes-${chartId}`)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveNotes(chartId: string, notes: Annotation[]) {
  localStorage.setItem(`jirajira-notes-${chartId}`, JSON.stringify(notes))
}

export function AnnotatableChart({ chartId, children }: AnnotatableChartProps) {
  const [notes, setNotes] = useState<Annotation[]>(() => loadNotes(chartId))

  const persist = useCallback(
    (updated: Annotation[]) => {
      setNotes(updated)
      saveNotes(chartId, updated)
    },
    [chartId],
  )

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const newNote: Annotation = { id: crypto.randomUUID(), x, y, text: '' }
      persist([...notes, newNote])
    },
    [notes, persist],
  )

  const handleMove = useCallback(
    (id: string, x: number, y: number) => {
      persist(notes.map((n) => (n.id === id ? { ...n, x, y } : n)))
    },
    [notes, persist],
  )

  const handleChange = useCallback(
    (id: string, text: string) => {
      persist(notes.map((n) => (n.id === id ? { ...n, text } : n)))
    },
    [notes, persist],
  )

  const handleDelete = useCallback(
    (id: string) => {
      persist(notes.filter((n) => n.id !== id))
    },
    [notes, persist],
  )

  return (
    <div className="relative" onDoubleClick={handleDoubleClick}>
      {children}
      {notes.map((note) => (
        <PostIt
          key={note.id}
          annotation={note}
          onMove={handleMove}
          onChange={handleChange}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
