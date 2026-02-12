import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import type { FileStatus } from '@/types/jira'

interface DualFileDropZoneProps {
  onCreatedFileLoaded: (content: string) => void
  onClosedFileLoaded: (content: string) => void
  createdFileStatus: FileStatus
  closedFileStatus: FileStatus
}

function DropZone({
  label,
  description,
  status,
  onFileLoaded,
}: {
  label: string
  description: string
  status: FileStatus
  onFileLoaded: (content: string) => void
}) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        onFileLoaded(content)
      }
      reader.readAsText(file)
    },
    [onFileLoaded]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const file = e.dataTransfer.files[0]
      if (file && file.name.endsWith('.xml')) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleClick = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xml'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        handleFile(file)
      }
    }
    input.click()
  }, [handleFile])

  const isLoaded = status === 'loaded'
  const isError = status === 'error'

  return (
    <div
      onClick={isLoaded ? undefined : handleClick}
      onDrop={isLoaded ? undefined : handleDrop}
      onDragOver={isLoaded ? undefined : handleDragOver}
      onDragLeave={isLoaded ? undefined : handleDragLeave}
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 transition-colors',
        isLoaded
          ? 'border-green-500/50 bg-green-500/5'
          : isError
            ? 'border-red-500/50 bg-red-500/5'
            : isDragOver
              ? 'border-primary bg-primary/5 cursor-pointer'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer'
      )}
    >
      <div className="text-4xl">
        {isLoaded ? '✓' : isError ? '✗' : '📄'}
      </div>
      <div className="text-center">
        <p className="text-lg font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {isLoaded
            ? 'Archivo cargado'
            : isError
              ? 'Error al cargar archivo'
              : description}
        </p>
      </div>
    </div>
  )
}

export function DualFileDropZone({
  onCreatedFileLoaded,
  onClosedFileLoaded,
  createdFileStatus,
  closedFileStatus,
}: DualFileDropZoneProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <DropZone
        label="Tickets Creados"
        description="Arrastra Creados.xml o haz click"
        status={createdFileStatus}
        onFileLoaded={onCreatedFileLoaded}
      />
      <DropZone
        label="Tickets Cerrados"
        description="Arrastra Cerrados.xml o haz click"
        status={closedFileStatus}
        onFileLoaded={onClosedFileLoaded}
      />
    </div>
  )
}
