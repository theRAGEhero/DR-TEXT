"use client"

import React from 'react'
import { MessageSquareText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TextMessage } from '@/types/message'

interface MessageListProps {
  messages: TextMessage[]
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No messages yet. Send the first TextRound update.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className="rounded-lg border border-border bg-background p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="h-3.5 w-3.5" />
                  <span>Message</span>
                </div>
                <span>
                  {new Date(message.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.text}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
