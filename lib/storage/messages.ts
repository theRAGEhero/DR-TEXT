import fs from 'fs/promises'
import path from 'path'
import { TextMessage } from '@/types/message'
import { getLogger } from '@/lib/logging/logger'

const logger = getLogger('storage.messages')

const DATA_DIR = path.join(process.cwd(), 'data')
const MESSAGES_DIR = path.join(DATA_DIR, 'messages')

async function ensureMessagesFile(roundId: string) {
  await fs.mkdir(MESSAGES_DIR, { recursive: true })
  const filePath = path.join(MESSAGES_DIR, `${roundId}.json`)
  try {
    await fs.access(filePath)
  } catch {
    await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf-8')
  }
  return filePath
}

export async function getMessages(roundId: string): Promise<TextMessage[]> {
  logger.debug('Fetching messages', { roundId })
  try {
    const filePath = await ensureMessagesFile(roundId)
    const content = await fs.readFile(filePath, 'utf-8')
    const messages = JSON.parse(content) as TextMessage[]
    logger.info('Messages fetched successfully', { roundId, count: messages.length })
    return messages
  } catch (error) {
    logger.error('Failed to fetch messages', { error, roundId })
    throw error
  }
}

export async function addMessage(roundId: string, message: TextMessage): Promise<TextMessage> {
  logger.info('Adding message', { roundId, messageId: message.id })
  try {
    const filePath = await ensureMessagesFile(roundId)
    const content = await fs.readFile(filePath, 'utf-8')
    const messages = JSON.parse(content) as TextMessage[]
    messages.push(message)
    await fs.writeFile(filePath, JSON.stringify(messages, null, 2), 'utf-8')
    logger.info('Message added successfully', { roundId, messageId: message.id })
    return message
  } catch (error) {
    logger.error('Failed to add message', { error, roundId })
    throw error
  }
}

export async function deleteMessages(roundId: string): Promise<void> {
  logger.info('Deleting messages file', { roundId })
  try {
    const filePath = path.join(MESSAGES_DIR, `${roundId}.json`)
    await fs.unlink(filePath)
    logger.info('Messages file deleted', { roundId })
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      logger.warn('Messages file not found for deletion', { roundId })
      return
    }
    logger.error('Failed to delete messages file', { error, roundId })
    throw error
  }
}
