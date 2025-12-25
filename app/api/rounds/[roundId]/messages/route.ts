import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getRound, updateRound } from '@/lib/storage/rounds'
import { addMessage, getMessages } from '@/lib/storage/messages'
import { TextMessage } from '@/types/message'
import { createRequestId, getLogger } from '@/lib/logging/logger'

const logger = getLogger('api.rounds.messages')

export async function GET(
  _request: NextRequest,
  { params }: { params: { roundId: string } }
) {
  const requestId = createRequestId()
  const log = logger.withContext({ requestId, roundId: params.roundId })

  try {
    const round = await getRound(params.roundId)
    if (!round) {
      log.warn('Round not found')
      return NextResponse.json({ error: 'Round not found' }, { status: 404 })
    }

    const messages = await getMessages(params.roundId)
    log.info('Messages fetched successfully', { count: messages.length })
    return NextResponse.json({ messages })
  } catch (error) {
    log.error('Error fetching messages', { error })
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { roundId: string } }
) {
  const requestId = createRequestId()
  const log = logger.withContext({ requestId, roundId: params.roundId })

  try {
    const round = await getRound(params.roundId)
    if (!round) {
      log.warn('Round not found')
      return NextResponse.json({ error: 'Round not found' }, { status: 404 })
    }

    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      log.warn('Invalid message text provided', { text })
      return NextResponse.json(
        { error: 'Text is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    const message: TextMessage = {
      id: uuidv4(),
      roundId: params.roundId,
      text: text.trim(),
      created_at: new Date().toISOString()
    }

    await addMessage(params.roundId, message)
    const messages = await getMessages(params.roundId)

    const generatedTitle = getGeneratedTitle(round, message.text)
    const updatedRound = await updateRound(params.roundId, {
      message_count: messages.length,
      last_message_at: message.created_at,
      name: generatedTitle
    })

    log.info('Message created successfully', { messageId: message.id })
    return NextResponse.json({
      message,
      messages,
      round: updatedRound ?? round
    }, { status: 201 })
  } catch (error) {
    log.error('Error creating message', { error })
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
  }
}

function getGeneratedTitle(round: { name?: string }, text: string) {
  if (round.name && round.name.trim().length > 0) {
    return round.name
  }

  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return undefined

  const sentenceBreak = clean.split(/[.!?]/)[0]
  const snippet = sentenceBreak.length > 60 ? `${sentenceBreak.slice(0, 60).trim()}...` : sentenceBreak
  return snippet
}
