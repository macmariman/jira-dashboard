import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FileStatus } from '@/types/jira'

interface SheetUrlInputProps {
  onSubmit: (url: string) => void
  status: FileStatus
}

const STORAGE_KEY = 'jirajira-sheet-url'

export function SheetUrlInput({ onSubmit, status }: SheetUrlInputProps) {
  const [url, setUrl] = useState(() => localStorage.getItem(STORAGE_KEY) ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      localStorage.setItem(STORAGE_KEY, url.trim())
      onSubmit(url.trim())
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Google Sheet (CSV)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit" disabled={!url.trim() || status === 'loading'}>
            {status === 'loading' ? 'Cargando...' : 'Cargar'}
          </Button>
        </form>
        {status === 'error' && (
          <p className="mt-2 text-sm text-destructive">Error al cargar el sheet. Verificá que la URL sea correcta y el sheet esté publicado.</p>
        )}
        {status === 'loaded' && (
          <p className="mt-2 text-sm text-green-600">Sheet cargado correctamente.</p>
        )}
      </CardContent>
    </Card>
  )
}
