import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { JiraIssueWithDates } from '@/types/jira'

interface OutputAnalysisProps {
  closedIssues: JiraIssueWithDates[]
}

function IssueTable({ issues }: { issues: JiraIssueWithDates[] }) {
  if (issues.length === 0) {
    return <p className="text-muted-foreground text-sm py-4 text-center">Sin tickets</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-4 font-medium">Tipo</th>
            <th className="py-2 pr-4 font-medium">Ticket</th>
            <th className="py-2 pr-4 font-medium">Épica</th>
            <th className="py-2 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.key} className="border-b last:border-0">
              <td className="py-2 pr-4">{issue.type}</td>
              <td className="py-2 pr-4">
                <span className="text-muted-foreground">{issue.key}</span>{' '}
                {issue.summary}
              </td>
              <td className="py-2 pr-4 text-muted-foreground">{issue.parent ?? '—'}</td>
              <td className="py-2">{issue.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function OutputAnalysis({ closedIssues }: OutputAnalysisProps) {
  const importantes = closedIssues.filter((i) => i.label === 'Inactiva')
  const tareas = closedIssues.filter((i) => i.label === 'Tarea')

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Análisis de Output
          <span className="ml-2 text-base font-normal text-muted-foreground">
            ({closedIssues.length} tickets)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-green-500/50 overflow-hidden">
          <div className="bg-green-500 px-4 py-1.5 text-center text-sm font-semibold text-white">
            Importantes ({importantes.length})
          </div>
          <div className="p-4">
            <IssueTable issues={importantes} />
          </div>
        </div>

        <div className="rounded-lg border border-red-700/50 overflow-hidden">
          <div className="bg-red-700 px-4 py-1.5 text-center text-sm font-semibold text-white">
            Todo lo demás ({tareas.length})
          </div>
          <div className="p-4">
            <IssueTable issues={tareas} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
