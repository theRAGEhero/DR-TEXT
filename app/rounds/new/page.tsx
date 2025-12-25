"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NewRoundPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const createRound = async () => {
      try {
        const response = await fetch('/api/rounds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to create round')
        }

        const data = await response.json()
        router.replace(`/rounds/${data.round.id}`)
      } catch (err) {
        const error = err as Error
        setError(error.message)
      }
    }

    createRound()
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8">
          <div className="text-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-semibold">Creating your TextRound</h1>
            <p className="text-sm text-muted-foreground">
              Hang tight while we set things up.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              <p className="font-semibold mb-2">Could not create TextRound:</p>
              <p>{error}</p>
              <Button
                onClick={() => location.reload()}
                variant="outline"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
