import { useRef, useState } from 'react'
import { DualFileDropZone } from '@/components/DualFileDropZone'
import { SheetUrlInput } from '@/components/SheetUrlInput'
import { TrendLineChart } from '@/components/TrendLineChart'
import { CarryOverChart } from '@/components/CarryOverChart'
import { AnnotatableChart } from '@/components/AnnotatableChart'
import { OutputAnalysis } from '@/components/OutputAnalysis'
import { Button } from '@/components/ui/button'
import { prepareLineChartData } from '@/lib/jira-parser'
import { jiraXmlAdapter } from '@/adapters/jira-xml-adapter'
import { csvAdapter } from '@/adapters/csv-adapter'
import type { IssueRow } from '@/types/issue-table'
import type { FileStatus } from '@/types/jira'

export function App() {
  const [createdIssues, setCreatedIssues] = useState<IssueRow[] | null>(null)
  const [closedIssues, setClosedIssues] = useState<IssueRow[] | null>(null)
  const [createdFileStatus, setCreatedFileStatus] = useState<FileStatus>('empty')
  const [closedFileStatus, setClosedFileStatus] = useState<FileStatus>('empty')
  const [sheetStatus, setSheetStatus] = useState<FileStatus>('empty')
  const [reloading, setReloading] = useState(false)
  const sheetUrlRef = useRef<string | null>(null)

  const handleCreatedFileLoaded = (content: string) => {
    setCreatedFileStatus('loading')
    try {
      const parsed = jiraXmlAdapter.parse(content)
      setCreatedIssues(parsed)
      setCreatedFileStatus('loaded')
    } catch {
      setCreatedFileStatus('error')
    }
  }

  const handleClosedFileLoaded = (content: string) => {
    setClosedFileStatus('loading')
    try {
      const parsed = jiraXmlAdapter.parse(content)
      setClosedIssues(parsed)
      setClosedFileStatus('loaded')
    } catch {
      setClosedFileStatus('error')
    }
  }

  const handleSheetUrl = async (url: string) => {
    setSheetStatus('loading')
    try {
      const response = await fetch(url)
      const text = await response.text()
      const allIssues = csvAdapter.parse(text)
      setCreatedIssues(allIssues)
      setClosedIssues(allIssues.filter((i) => i.resolvedDate))
      sheetUrlRef.current = url
      setSheetStatus('loaded')
    } catch {
      setSheetStatus('error')
    }
  }

  const handleReload = async () => {
    if (!sheetUrlRef.current) return
    setReloading(true)
    try {
      const response = await fetch(sheetUrlRef.current)
      const text = await response.text()
      const allIssues = csvAdapter.parse(text)
      setCreatedIssues(allIssues)
      setClosedIssues(allIssues.filter((i) => i.resolvedDate))
    } catch {
      setSheetStatus('error')
    } finally {
      setReloading(false)
    }
  }

  const handleReset = () => {
    setCreatedIssues(null)
    setClosedIssues(null)
    setCreatedFileStatus('empty')
    setClosedFileStatus('empty')
    setSheetStatus('empty')
    sheetUrlRef.current = null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="JiraJira"
              className="h-10 w-10 cursor-pointer"
              onDoubleClick={() => window.open('https://www.youtube.com/watch?v=CdPrhRpQ5KA&list=RDCdPrhRpQ5KA&start_radio=1', '_blank')}
            />
            <div className="flex flex-col leading-tight">
              <h1 className="text-xl font-semibold tracking-tight">Metricor</h1>
              <span className="text-[11px] italic text-muted-foreground">El aroma de lo que importa</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {sheetUrlRef.current && (createdIssues || closedIssues) && (
              <Button variant="outline" onClick={handleReload} disabled={reloading}>
                {reloading ? 'Recargando...' : 'Recargar datos'}
              </Button>
            )}
            {(createdIssues || closedIssues) && (
              <Button variant="outline" onClick={handleReset}>
                Cargar otros archivos
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!createdIssues || !closedIssues ? (
          <div className="mx-auto max-w-4xl space-y-6">
            <SheetUrlInput onSubmit={handleSheetUrl} status={sheetStatus} />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">o</span>
              </div>
            </div>
            <DualFileDropZone
              onCreatedFileLoaded={handleCreatedFileLoaded}
              onClosedFileLoaded={handleClosedFileLoaded}
              createdFileStatus={createdFileStatus}
              closedFileStatus={closedFileStatus}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <AnnotatableChart chartId="trend">
              <TrendLineChart data={prepareLineChartData(createdIssues, closedIssues)} />
            </AnnotatableChart>
            <AnnotatableChart chartId="carryover">
              <CarryOverChart issues={createdIssues} />
            </AnnotatableChart>
            <OutputAnalysis closedIssues={closedIssues} />
          </div>
        )}
      </main>

    </div>
  )
}

export default App
