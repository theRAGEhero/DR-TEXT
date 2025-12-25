import { NextRequest, NextResponse } from 'next/server'
import { deleteRound, getRound, updateRound } from '@/lib/storage/rounds'
import { TextRound, TextRoundStatus } from '@/types/text-round'
import { createRequestId, getLogger } from '@/lib/logging/logger'

const logger = getLogger('api.rounds.detail')

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
    log.info('Round fetched successfully')
    return NextResponse.json({ round })
  } catch (error) {
    log.error('Error fetching round', { error })
    return NextResponse.json({ error: 'Failed to fetch round' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { roundId: string } }
) {
  const requestId = createRequestId()
  const log = logger.withContext({ requestId, roundId: params.roundId })

  try {
    const body = await request.json()
    const updates: Partial<TextRound> = {}

    if (typeof body.name === 'string') {
      updates.name = body.name.trim() || undefined
    }
    if (typeof body.description === 'string') {
      updates.description = body.description.trim() || undefined
    }
    if (body.status && Object.values(TextRoundStatus).includes(body.status)) {
      updates.status = body.status
    }

    if (Object.keys(updates).length === 0) {
      log.warn('No valid updates provided')
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 })
    }

    const updated = await updateRound(params.roundId, updates)
    if (!updated) {
      log.warn('Round not found for update')
      return NextResponse.json({ error: 'Round not found' }, { status: 404 })
    }

    log.info('Round updated successfully')
    return NextResponse.json({ round: updated })
  } catch (error) {
    log.error('Error updating round', { error })
    return NextResponse.json({ error: 'Failed to update round' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { roundId: string } }
) {
  const requestId = createRequestId()
  const log = logger.withContext({ requestId, roundId: params.roundId })

  try {
    const deleted = await deleteRound(params.roundId)
    if (!deleted) {
      log.warn('Round not found for deletion')
      return NextResponse.json({ error: 'Round not found' }, { status: 404 })
    }
    log.info('Round deleted successfully')
    return NextResponse.json({ message: 'Round deleted successfully' })
  } catch (error) {
    log.error('Error deleting round', { error })
    return NextResponse.json({ error: 'Failed to delete round' }, { status: 500 })
  }
}
