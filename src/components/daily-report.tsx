'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DailySummary } from "@/lib/supabase"

interface DailyReportProps {
  summaries: DailySummary[]
  selectedTopic: string
}

export function DailyReport({ summaries, selectedTopic }: DailyReportProps) {
  const [selectedDate, setSelectedDate] = useState<string>("")

  const topicSummaries = summaries.filter(summary => summary.topic === selectedTopic)
  console.log('Topic summaries for', selectedTopic, ':', topicSummaries)
  const selectedSummary = summaries.find(summary => summary.summary_date === selectedDate && summary.topic === selectedTopic)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ежедневный отчет</CardTitle>
        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Выберите дату" />
          </SelectTrigger>
          <SelectContent>
            {summaries.map((summary) => (
              <SelectItem key={summary.id} value={summary.summary_date}>
                {formatDate(summary.summary_date)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {selectedSummary ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Сводка за {formatDate(selectedSummary.summary_date)}</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedSummary.ai_summary}
              </p>
            </div>
            
            {selectedSummary.key_themes && selectedSummary.key_themes.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Ключевые темы:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedSummary.key_themes.map((theme, index) => (
                    <li key={index} className="text-sm text-gray-600">{theme}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {selectedSummary.avg_positive_percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Среднее позитивное</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {selectedSummary.avg_negative_percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Среднее негативное</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedSummary.avg_neutral_percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Среднее нейтральное</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {selectedSummary.total_analyzed}
                </div>
                <div className="text-sm text-gray-500">Всего проанализировано</div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Выберите дату для просмотра отчета</p>
        )}
      </CardContent>
    </Card>
  )
}