'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, ExternalLink, Trash2 } from 'lucide-react'

interface SavedIdea {
  id: string
  title: string
  source: string
  summary: string
  category: string
  savedAt: string
  liked: boolean
}

export default function SavedIdeasPage() {
  const [ideas, setIdeas] = useState<SavedIdea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch('/api/content?type=ideas')
        const data = await response.json()
        setIdeas(data)
      } catch (error) {
        console.error('Failed to fetch ideas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchIdeas()
  }, [])

  const handleDelete = (id: string) => {
    setIdeas(ideas.filter((idea) => idea.id !== id))
  }

  const handleLike = (id: string) => {
    setIdeas(
      ideas.map((idea) =>
        idea.id === id ? { ...idea, liked: !idea.liked } : idea
      )
    )
  }

  const categoryColors: Record<string, string> = {
    'Product': 'default',
    'Marketing': 'secondary',
    'Technology': 'accent',
    'Business': 'destructive',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Saved Ideas</h1>
        <p className="mt-2 text-muted-foreground">
          Your collection of interesting insights and ideas
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading ideas...</div>
        </div>
      ) : ideas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold">No saved ideas yet</h3>
              <p className="mt-2 text-muted-foreground">
                Start adding content to build your collection
              </p>
              <Link href="/dashboard/add-content">
                <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90">
                  Add Content
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <Card
              key={idea.id}
              className="flex flex-col transition-all hover:shadow-md hover:border-primary"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/dashboard/${idea.id}`} className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 hover:text-primary">
                      {idea.title}
                    </CardTitle>
                  </Link>
                  <button
                    onClick={() => handleLike(idea.id)}
                    className="flex-shrink-0"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        idea.liked
                          ? 'fill-destructive text-destructive'
                          : 'text-muted-foreground hover:text-destructive'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{idea.source}</p>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {idea.summary}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <Badge variant={categoryColors[idea.category] as any}>
                    {idea.category}
                  </Badge>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/${idea.id}`}>
                      <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Link>
                    <button
                      onClick={() => handleDelete(idea.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
