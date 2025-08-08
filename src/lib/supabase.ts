import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://itibqdwpspbrxpjgwojd.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aWJxZHdwc3Bicnhwamd3b2pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NTEyNjgsImV4cCI6MjA3MDEyNzI2OH0.POLXmdtERwKloQVaguFHHxnZ8q-TazSujPr4LHoyhuY'

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface SentimentData {
  topic: string
  time_bucket: string
  positive_percentage: number
  negative_percentage: number
  neutral_percentage: number
  sentiment_score: number
  total_tweets: number
}

export interface DailySummary {
  id: number
  topic: string
  summary_date: string
  ai_summary: string
  key_themes: string[]
  sentiment_trend: string
  total_analyzed: number
  avg_positive_percentage: number
  avg_negative_percentage: number
  avg_neutral_percentage: number
  comparison_yesterday: Record<string, unknown>
  created_at: string
}