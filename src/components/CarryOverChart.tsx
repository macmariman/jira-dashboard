import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { IssueRow } from '@/types/issue-table'

interface CarryOverChartProps {
  issues: IssueRow[]
}

export interface SprintBreakdown {
  sprint: string
  carryOver: number
  new: number
}

export function prepareCarryOverData(issues: IssueRow[]): SprintBreakdown[] {
  const sprintSet = new Set<string>()
  for (const issue of issues) {
    for (const s of issue.sprints) {
      sprintSet.add(s)
    }
  }

  const sprints = Array.from(sprintSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  const sprintIndex = new Map(sprints.map((s, i) => [s, i]))

  return sprints.map((sprint) => {
    const idx = sprintIndex.get(sprint)!
    let carryOver = 0
    let newCount = 0

    for (const issue of issues) {
      if (!issue.sprints.includes(sprint)) continue
      const hasEarlierSprint = issue.sprints.some((s) => (sprintIndex.get(s) ?? Infinity) < idx)
      if (hasEarlierSprint) {
        carryOver++
      } else {
        newCount++
      }
    }

    return { sprint, carryOver, new: newCount }
  })
}

const chartConfig: ChartConfig = {
  carryOver: {
    label: 'Carry Over',
    color: '#f59e0b',
  },
  new: {
    label: 'Nuevos',
    color: '#3b82f6',
  },
}

const labelMap: Record<string, string> = {
  carryOver: 'Carry Over',
  new: 'Nuevos',
}

export function CarryOverChart({ issues }: CarryOverChartProps) {
  const data = prepareCarryOverData(issues)

  if (data.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carry Over por Sprint</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart data={data} margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sprint" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(value: number, name: string) => [value, labelMap[name] ?? name]} />
            <Legend formatter={(value: string) => labelMap[value] ?? value} />
            <Bar dataKey="carryOver" stackId="a" fill="#f59e0b" name="carryOver" />
            <Bar dataKey="new" stackId="a" fill="#3b82f6" name="new" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
