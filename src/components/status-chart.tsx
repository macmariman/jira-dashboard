import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StatusCount } from '@/types/jira'

interface StatusChartProps {
  data: StatusCount[]
}

const categoryColors: Record<string, string> = {
  done: '#22c55e',
  indeterminate: '#eab308',
  new: '#3b82f6',
}

export function StatusChart({ data }: StatusChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    fill: categoryColors[item.category] ?? '#6b7280',
  }))

  const chartConfig: ChartConfig = {
    count: {
      label: 'Issues',
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issues por Estado</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 40 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="status"
              tickLine={false}
              axisLine={false}
              width={120}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
