'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react'

interface ActionItem {
  id: string
  title: string
  source: string
  action: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

export default function DashboardPage() {
  const [actions, setActions] = useState<ActionItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const response = await fetch('/api/content?type=actions')
        const data = await response.json()
        setActions(data.slice(0, 5)) // Show top 5 actions
      } catch (error) {
        console.error('Failed to fetch actions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActions()
  }, [])

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Today&apos;s Action Items</h1>
        <p className="mt-2 text-muted-foreground">
          Your personalized list of actionable insights from saved content
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading actions...</div>
        </div>
      ) : actions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold">No action items yet</h3>
              <p className="mt-2 text-muted-foreground">
                Add content to get AI-generated action items
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
        <div className="space-y-3">
          {actions.map((action) => (
            <Card
              key={action.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
            >
              <CardContent className="flex items-start gap-4 pt-6">
                <button
                  onClick={() => {
                    setActions(
                      actions.map((a) =>
                        a.id === action.id ? { ...a, completed: !a.completed } : a
                      )
                    )
                  }}
                  className="mt-1 flex-shrink-0"
                >
                  {action.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold ${
                          action.completed ? 'text-muted-foreground line-through' : ''
                        }`}
                      >
                        {action.action}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{action.source}</p>
                    </div>
                    <Badge variant={priorityColor(action.priority)}>
                      {action.priority}
                    </Badge>
                  </div>
                </div>

                <Link href={`/dashboard/${action.id}`} className="flex-shrink-0">
                  <ExternalLink className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
