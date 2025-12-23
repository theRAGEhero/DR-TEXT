"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateRoundForm } from '@/components/rounds/CreateRoundForm'

export default function NewRoundPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/rounds">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rounds
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">Create New TextRound</h1>
          <p className="text-muted-foreground mt-2">
            Set up a new space for collecting text updates.
          </p>
        </div>

        <CreateRoundForm />
      </div>
    </div>
  )
}
