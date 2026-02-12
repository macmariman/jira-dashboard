import { useState } from 'react'
import { DualFileDropZone } from '@/components/DualFileDropZone'
import { TrendLineChart } from '@/components/TrendLineChart'
import { OutputAnalysis } from '@/components/OutputAnalysis'
import { Button } from '@/components/ui/button'
import { parseJiraXmlWithDates, prepareLineChartData } from '@/lib/jira-parser'
import type { JiraIssueWithDates, FileStatus } from '@/types/jira'

export function App() {
  const [createdIssues, setCreatedIssues] = useState<JiraIssueWithDates[] | null>(null)
  const [closedIssues, setClosedIssues] = useState<JiraIssueWithDates[] | null>(null)
  const [createdFileStatus, setCreatedFileStatus] = useState<FileStatus>('empty')
  const [closedFileStatus, setClosedFileStatus] = useState<FileStatus>('empty')

  const handleCreatedFileLoaded = (content: string) => {
    setCreatedFileStatus('loading')
    try {
      const parsed = parseJiraXmlWithDates(content)
      setCreatedIssues(parsed)
      setCreatedFileStatus('loaded')
    } catch {
      setCreatedFileStatus('error')
    }
  }

  const handleClosedFileLoaded = (content: string) => {
    setClosedFileStatus('loading')
    try {
      const parsed = parseJiraXmlWithDates(content)
      setClosedIssues(parsed)
      setClosedFileStatus('loaded')
    } catch {
      setClosedFileStatus('error')
    }
  }

  const handleReset = () => {
    setCreatedIssues(null)
    setClosedIssues(null)
    setCreatedFileStatus('empty')
    setClosedFileStatus('empty')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="JiraJira"
              className="h-8 w-8 cursor-pointer"
              onDoubleClick={() => window.open('https://www.youtube.com/watch?v=CdPrhRpQ5KA&list=RDCdPrhRpQ5KA&start_radio=1', '_blank')}
            />
            <h1 className="text-xl font-semibold">JiraJira</h1>
          </div>
          {(createdIssues || closedIssues) && (
            <Button variant="outline" onClick={handleReset}>
              Cargar otros archivos
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!createdIssues || !closedIssues ? (
          <div className="mx-auto max-w-4xl">
            <DualFileDropZone
              onCreatedFileLoaded={handleCreatedFileLoaded}
              onClosedFileLoaded={handleClosedFileLoaded}
              createdFileStatus={createdFileStatus}
              closedFileStatus={closedFileStatus}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <TrendLineChart data={prepareLineChartData(createdIssues, closedIssues)} />
            <OutputAnalysis createdIssues={createdIssues} closedIssues={closedIssues} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
