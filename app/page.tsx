import Link from 'next/link'
import { MessageSquareText, Send, ListChecks, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            TextRounds
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create a TextRound, gather short updates, and keep every message organized in one place.
          </p>
          <div className="flex items-center justify-center space-x-4 pt-4">
            <Link href="/rounds/new">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create New Round
              </Button>
            </Link>
            <Link href="/rounds">
              <Button variant="outline" size="lg">
                View All Rounds
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <div className="rounded-full bg-primary/10 p-3">
                  <MessageSquareText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Create Rounds</CardTitle>
              </div>
              <CardDescription>
                Name each TextRound and describe the kind of updates you want to collect.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <div className="rounded-full bg-primary/10 p-3">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Send Text</CardTitle>
              </div>
              <CardDescription>
                Share a round link and let people drop their message in seconds.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <div className="rounded-full bg-primary/10 p-3">
                  <ListChecks className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Review Updates</CardTitle>
              </div>
              <CardDescription>
                See every text entry in order with timestamps and quick counts.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              A simple flow for quick, structured feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto">
                1
              </div>
              <h3 className="font-semibold">Create a Round</h3>
              <p className="text-sm text-muted-foreground">
                Give your TextRound a name and a short prompt.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto">
                2
              </div>
              <h3 className="font-semibold">Collect Messages</h3>
              <p className="text-sm text-muted-foreground">
                Anyone with the link can send a message in seconds.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto">
                3
              </div>
              <h3 className="font-semibold">Review & Share</h3>
              <p className="text-sm text-muted-foreground">
                Keep track of all updates in one tidy timeline.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center bg-muted/50 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to start a TextRound?</h2>
          <p className="text-muted-foreground mb-6">
            Create your first round and start collecting text updates right away.
          </p>
          <Link href="/rounds/new">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Round
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
