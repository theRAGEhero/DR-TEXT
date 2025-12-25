export interface TextRound {
  id: string
  name?: string
  description?: string
  created_at: string
  status: TextRoundStatus
  message_count: number
  last_message_at?: string
}

export enum TextRoundStatus {
  OPEN = "open",
  CLOSED = "closed"
}

export interface CreateTextRoundInput {
  name?: string
  description?: string
}
