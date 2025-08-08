'use client'

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SentimentData } from "@/lib/supabase"

const chartConfig = {
  positive_percentage: {
    label: "Positive",
    color: "#22c55e", // green
  },
  negative_percentage: {
    label: "Negative", 
    color: "#ef4444", // red
  },
  neutral_percentage: {
    label: "Neutral",
    color: "#3b82f6", // blue
  },
}

interface SentimentChartProps {
  data: SentimentData[]
}

export function SentimentChart({ data }: SentimentChartProps) {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleDateString('ru-RU', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Анализ сентимента по времени</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} height={280}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time_bucket"
              tickFormatter={formatTime}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              label={{ value: 'Процент (%)', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              labelFormatter={(value) => `Время: ${formatTime(value)}`}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line 
              type="monotone" 
              dataKey="positive_percentage" 
              stroke="var(--color-positive_percentage)" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="negative_percentage" 
              stroke="var(--color-negative_percentage)" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="neutral_percentage" 
              stroke="var(--color-neutral_percentage)" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}