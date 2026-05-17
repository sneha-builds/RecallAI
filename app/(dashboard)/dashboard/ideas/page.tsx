'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, ExternalLink, Trash2 } from 'lucide-react'

interface SavedIdea {
  id: string
  title: string
  source?: string
  summary: string
  category?: string
  createdAt: string
  liked?: boolean
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
    // Signal the deletion to other pages via BroadcastChannel
    try {
      const channel = new BroadcastChannel('recall_ideas')
      channel.postMessage({ type: 'ideaDeleted', id })
      channel.close()
    } catch (e) {
      // BroadcastChannel not available, fallback to localStorage
      localStorage.setItem('lastDeletedIdeaId', id)
    }
  }

  const handleLike = async (id: string) => {
    try {
      const idea = ideas.find(i => i.id === id)
      if (!idea) return

      const response = await fetch(`/api/content?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked: !idea.liked }),
      })

      if (response.ok) {
        setIdeas(
          ideas.map((idea) =>
            idea.id === id ? { ...idea, liked: !idea.liked } : idea
          )
        )
      }
    } catch (error) {
      console.error('Error liking idea:', error)
    }
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
        <h1 className="text-2xl font-bold sm:text-3xl">Saved Ideas</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Your collection of interesting insights and ideas
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading ideas...</div>
        </div>
      ) : ideas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
            <div className="text-center px-4">
              <h3 className="text-base font-semibold sm:text-lg">Nothing yet</h3>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Create your first action to be done
              </p>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Start by adding content
              </p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Let&apos;s get to work
              </p>
              <Link href="/dashboard/add-content">
                <button className="mt-4 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90 sm:px-4 sm:py-2 sm:text-base">
                  Add Content
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 grid-cols-1 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <Card
              key={idea.id}
              className="flex flex-col transition-all hover:shadow-md hover:border-primary"
            >
              <CardHeader className="pb-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/dashboard/${idea.id}`} className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg line-clamp-2 hover:text-primary">
                      {idea.title}
                    </CardTitle>
                  </Link>
                  <button
                    onClick={() => handleLike(idea.id)}
                    className="flex-shrink-0 mt-1"
                  >
                    <Heart
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        idea.liked
                          ? 'fill-destructive text-destructive'
                          : 'text-muted-foreground hover:text-destructive'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground truncate">{idea.source}</p>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                  {idea.summary}
                </p>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <Badge variant={categoryColors[idea.category || 'Product'] as any} className="w-fit text-xs sm:text-sm">
                    {idea.category || 'General'}
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
