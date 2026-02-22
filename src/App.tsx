import { useRef, useState } from 'react'
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
  const [showLamona, setShowLamona] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
          <div className="flex items-center gap-2">
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
            <OutputAnalysis closedIssues={closedIssues} />
          </div>
        )}
      </main>

      {showLamona && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 cursor-pointer animate-[fadeIn_0.3s_ease-out]"
          onClick={() => {
            setShowLamona(false)
            if (audioRef.current) {
              audioRef.current.pause()
              audioRef.current = null
            }
          }}
        >
          <div className="relative animate-[lamonaIn_0.5s_ease-out]">
            <img
              src="/Lamona.png"
              alt="Productividad incrementada"
              className="max-h-[80vh] max-w-[80vw] rounded-xl shadow-2xl"
            />
            <div className="absolute inset-x-0 top-0 flex items-start justify-center pt-4 pointer-events-none">
              <p
                className="text-4xl md:text-6xl font-black text-white animate-[spinText_3s_linear_infinite] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                style={{ textShadow: '0 0 10px #ff0, 0 0 30px #f0f, 0 0 50px #0ff' }}
              >
                A mover el Bum Bum equipo!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
