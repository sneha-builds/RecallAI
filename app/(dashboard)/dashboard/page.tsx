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
        <h1 className="text-2xl font-bold sm:text-3xl">Today&apos;s Action Items</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Your personalized list of actionable insights from saved content
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading actions...</div>
        </div>
      ) : actions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                <div className="text-center px-4">
                  <h3 className="text-base font-semibold sm:text-lg">No action items yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    Add content to get AI-generated action items
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
        <div className="space-y-3">
          {actions.map((action) => (
            <Card
              key={action.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
            >
              <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-start sm:gap-4">
                <button
                  onClick={() => {
                    setActions(
                      actions.map((a) =>
                        a.id === action.id ? { ...a, completed: !a.completed } : a
                      )
                    )
                  }}
                  className="flex-shrink-0"
                >
                  {action.completed ? (
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-semibold sm:text-base ${
                          action.completed ? 'text-muted-foreground line-through' : ''
                        }`}
                      >
                        {action.action}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{action.source}</p>
                    </div>
                    <Badge variant={priorityColor(action.priority)} className="w-fit">
                      {action.priority}
                    </Badge>
                  </div>
                </div>

                <Link href={`/dashboard/${action.id}`} className="flex-shrink-0 self-end sm:self-start">
                  <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-foreground" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
