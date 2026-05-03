'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Heart, Share2, Trash2 } from 'lucide-react'

interface ContentDetail {
  id: string
  title: string
  source: string
  content: string
  category: string
  summary: string
  actions: string[]
  insights: string[]
  createdAt: string
  liked?: boolean
}

export default function ContentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [content, setContent] = useState<ContentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setContent(data)
          setLiked(data.liked || false)
        } else {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Failed to fetch content:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!content) {
    return null
  }

  const categoryColors: Record<string, string> = {
    'Product': 'default',
    'Marketing': 'secondary',
    'Technology': 'accent',
    'Business': 'destructive',
  }

  return (
    <div className="max-w-4xl space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold">{content.title}</h1>
            <p className="mt-2 text-muted-foreground">{content.source}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setLiked(!liked)}
              className="rounded-lg p-2 hover:bg-secondary"
            >
              <Heart
                className={`h-5 w-5 ${
                  liked ? 'fill-destructive text-destructive' : 'text-muted-foreground'
                }`}
              />
            </button>
            <button className="rounded-lg p-2 hover:bg-secondary">
              <Share2 className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="rounded-lg p-2 hover:bg-secondary">
              <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <Badge variant={categoryColors[content.category] as any}>
            {content.category}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {new Date(content.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Original Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-foreground">{content.content}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">{content.summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {content.insights.map((insight, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex-shrink-0 text-primary">•</span>
                <span className="text-foreground">{insight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {content.actions.map((action, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex-shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {idx + 1}
                </span>
                <span className="text-foreground">{action}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={() => router.back()}>Done</Button>
        <Button variant="outline" onClick={() => router.push('/dashboard/add-content')}>
          Add More Content
        </Button>
      </div>
    </div>
  )
}
