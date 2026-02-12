import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LineChartData } from '@/types/jira'

interface TrendLineChartProps {
  data: LineChartData[]
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
}

const chartConfig: ChartConfig = {
  created: {
    label: 'Creados (IN)',
    color: '#3b82f6',
  },
  closed: {
    label: 'Cerrados (OUT)',
    color: '#22c55e',
  },
}

export function TrendLineChart({ data }: TrendLineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia de Tickets: Creados vs Cerrados</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <LineChart data={data} margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              labelFormatter={formatDate}
              formatter={(value: number, name: string) => [
                value,
                name === 'created' ? 'Creados (IN)' : 'Cerrados (OUT)',
              ]}
            />
            <Legend
              formatter={(value: string) =>
                value === 'created' ? 'Creados (IN)' : 'Cerrados (OUT)'
              }
            />
            <Line
              type="monotone"
              dataKey="created"
              stroke="#3b82f6"
              name="created"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="closed"
              stroke="#22c55e"
              name="closed"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
