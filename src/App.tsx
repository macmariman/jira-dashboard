import { useState } from 'react'
import { FileDropZone } from '@/components/file-drop-zone'
import { StatusChart } from '@/components/status-chart'
import { Button } from '@/components/ui/button'
import { parseJiraXml, groupByStatus, getSprintInfo } from '@/lib/jira-parser'
import type { JiraIssue, SprintInfo } from '@/types/jira'

export function App() {
  const [issues, setIssues] = useState<JiraIssue[] | null>(null)
  const [sprintInfo, setSprintInfo] = useState<SprintInfo | null>(null)

  const handleFileLoaded = (content: string) => {
    const parsedIssues = parseJiraXml(content)
    const info = getSprintInfo(content)
    setIssues(parsedIssues)
    setSprintInfo(info)
  }

  const handleReset = () => {
    setIssues(null)
    setSprintInfo(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Jira Dashboard</h1>
          {issues && (
            <Button variant="outline" onClick={handleReset}>
              Cargar otro
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!issues ? (
          <div className="mx-auto max-w-md">
            <FileDropZone onFileLoaded={handleFileLoaded} />
          </div>
        ) : (
          <div className="space-y-6">
            {sprintInfo && (
              <div className="text-muted-foreground">
                Sprint: <span className="font-medium text-foreground">{sprintInfo.name}</span>
                {' '}&bull;{' '}
                {sprintInfo.totalIssues} issues
              </div>
            )}
            <StatusChart data={groupByStatus(issues)} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
