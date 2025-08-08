'use client'

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SentimentChart } from "@/components/sentiment-chart"
import { DailyReport } from "@/components/daily-report"
import { supabase, SentimentData, DailySummary } from "@/lib/supabase"

export default function Home() {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([])
  const [summaries, setSummaries] = useState<DailySummary[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string>("")
  const [topics, setTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedTopic) {
      fetchSentimentData(selectedTopic)
    }
  }, [selectedTopic])

  const fetchData = async () => {
    try {
      const [sentimentResponse, summariesResponse] = await Promise.all([
        supabase.from('latest_sentiment').select('*'),
        supabase.from('daily_summaries').select('*')
      ])

      if (sentimentResponse.error) throw sentimentResponse.error
      if (summariesResponse.error) throw summariesResponse.error

      const uniqueTopics = [...new Set(sentimentResponse.data.map(item => item.topic))]
      setTopics(uniqueTopics)
      setSummaries(summariesResponse.data)
      
      if (uniqueTopics.length > 0) {
        setSelectedTopic(uniqueTopics[0])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSentimentData = async (topic: string) => {
    try {
      const { data, error } = await supabase
        .from('latest_sentiment')
        .select('*')
        .eq('topic', topic)
        .order('time_bucket', { ascending: true })

      if (error) throw error
      setSentimentData(data)
    } catch (error) {
      console.error('Error fetching sentiment data:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Дашборд анализа сентимента
          </h1>
          <div className="flex justify-center">
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Выберите тему" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic.charAt(0).toUpperCase() + topic.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <SentimentChart data={sentimentData} />
          <DailyReport summaries={summaries} selectedTopic={selectedTopic} />
        </div>
      </div>
    </div>
  )
}
