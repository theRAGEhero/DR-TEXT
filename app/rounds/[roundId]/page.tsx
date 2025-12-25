"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, Trash2, Send, MessageSquareText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageList } from '@/components/messages/MessageList'
import { TextRound, TextRoundStatus } from '@/types/text-round'
import { TextMessage } from '@/types/message'

export default function RoundDetailPage({ params }: { params: { roundId: string } }) {
  const router = useRouter()
  const [round, setRound] = useState<TextRound | null>(null)
  const [messages, setMessages] = useState<TextMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [titleInput, setTitleInput] = useState('')
  const [isSavingTitle, setIsSavingTitle] = useState(false)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  const fetchRoundData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const roundResponse = await fetch(`/api/rounds/${params.roundId}`)
      if (!roundResponse.ok) {
        throw new Error('Round not found')
      }
      const roundData = await roundResponse.json()
      setRound(roundData.round)
      setTitleInput(roundData.round.name || '')

      const messagesResponse = await fetch(`/api/rounds/${params.roundId}/messages`)
      if (!messagesResponse.ok) {
        throw new Error('Failed to load messages')
      }
      const messagesData = await messagesResponse.json()
      setMessages(messagesData.messages)
    } catch (err) {
      const error = err as Error
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRoundData()
  }, [params.roundId])

  const handleTitleSave = async () => {
    if (!round) return
    setTitleError(null)
    setIsSavingTitle(true)

    try {
      const response = await fetch(`/api/rounds/${params.roundId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: titleInput })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update title')
      }

      const data = await response.json()
      setRound(data.round)
      setTitleInput(data.round.name || '')
    } catch (err) {
      const error = err as Error
      setTitleError(error.message)
    } finally {
      setIsSavingTitle(false)
    }
  }

  const handleDelete = async () => {
    if (!round) return
    const label = round.name || 'this TextRound'
    if (!confirm(`Are you sure you want to delete "${label}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/rounds/${params.roundId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete round')
      }

      router.push('/rounds')
    } catch (err) {
      const error = err as Error
      alert(`Error: ${error.message}`)
    }
  }

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault()
    setSendError(null)

    if (!messageText.trim()) {
      setSendError('Message text is required')
      return
    }

    setIsSending(true)
    try {
      const response = await fetch(`/api/rounds/${params.roundId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: messageText.trim() })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send message')
      }

      const data = await response.json()
      setMessages(data.messages)
      setRound(data.round)
      setTitleInput(data.round.name || '')
      setMessageText('')
    } catch (err) {
      const error = err as Error
      setSendError(error.message)
    } finally {
      setIsSending(false)
    }
  }

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Loading round...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !round) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Link href="/rounds">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rounds
            </Button>
          </Link>
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            {error || 'Round not found'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        <div>
          <Link href="/rounds">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rounds
            </Button>
          </Link>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3 min-w-0">
                <div className="flex-1 min-w-[220px]">
                  <input
                    value={titleInput}
                    onChange={(event) => setTitleInput(event.target.value)}
                    placeholder="Add a title (optional)"
                    className="w-full bg-transparent text-4xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground border-b border-transparent focus:border-primary/40 focus:outline-none"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTitleSave}
                  disabled={isSavingTitle}
                >
                  {isSavingTitle ? 'Saving...' : 'Save Title'}
                </Button>
                <Badge variant={getStatusVariant(round.status)}>
                  {getStatusLabel(round.status)}
                </Badge>
              </div>
              {titleError && (
                <div className="rounded-md bg-destructive/10 p-2 text-xs text-destructive max-w-md">
                  {titleError}
                </div>
              )}
              {round.description && (
                <p className="text-muted-foreground text-lg">
                  {round.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                <span>Created {new Date(round.created_at).toLocaleString()}</span>
                <span className="flex items-center gap-2">
                  <MessageSquareText className="h-4 w-4" />
                  {round.message_count} messages
                </span>
              </div>
            </div>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-start">
              <Button variant="outline" onClick={fetchRoundData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send a TextRound Update</CardTitle>
            <CardDescription>
              Add a short message to this round. It will appear in the timeline below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-4">
              {sendError && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {sendError}
                </div>
              )}
              {round.status === TextRoundStatus.CLOSED && (
                <div className="rounded-md bg-muted/70 p-3 text-sm text-muted-foreground">
                  This TextRound is closed to new messages.
                </div>
              )}
              <textarea
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                rows={4}
                placeholder="Type your update here..."
                disabled={round.status === TextRoundStatus.CLOSED}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <Button
                type="submit"
                disabled={isSending || round.status === TextRoundStatus.CLOSED}
                className="w-full"
              >
                {isSending ? 'Sending...' : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <MessageList messages={messages} />
      </div>
    </div>
  )
}
