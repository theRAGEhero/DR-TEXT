"use client"

import React from 'react'
import Link from 'next/link'
import { Clock, MessageSquareText, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TextRound, TextRoundStatus } from '@/types/text-round'

interface RoundCardProps {
  round: TextRound
  onDelete?: (roundId: string) => void
}

export function RoundCard({ round, onDelete }: RoundCardProps) {
  const getStatusVariant = (status: TextRoundStatus) => {
    switch (status) {
      case TextRoundStatus.OPEN:
        return 'default'
      case TextRoundStatus.CLOSED:
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: TextRoundStatus) => {
    switch (status) {
      case TextRoundStatus.OPEN:
        return 'Open'
      case TextRoundStatus.CLOSED:
        return 'Closed'
      default:
        return status
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No activity yet'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link href={`/rounds/${round.id}`} className="min-w-0">
              <CardTitle className="hover:text-primary cursor-pointer line-clamp-2 break-all">
                {round.name}
              </CardTitle>
            </Link>
            {round.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {round.description}
              </CardDescription>
            )}
          </div>
          <Badge variant={getStatusVariant(round.status)} className="ml-2 flex-shrink-0">
            {getStatusLabel(round.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MessageSquareText className="h-4 w-4" />
              <span>{round.message_count} messages</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDate(round.last_message_at)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              Created {formatDate(round.created_at)}
            </span>
            <div className="flex space-x-2">
              <Link href={`/rounds/${round.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    if (confirm(`Are you sure you want to delete "${round.name}"?`)) {
                      onDelete(round.id)
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
