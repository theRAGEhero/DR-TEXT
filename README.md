# TextRounds

TextRounds is a lightweight platform for creating text-based rounds, collecting short messages, and reviewing updates in a simple timeline.

## Features
- Create TextRounds with a name and optional description.
- Send text updates to a round with timestamps.
- View all rounds and message counts.
- File-backed storage (JSON) with structured logs.

## Local development
```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000`.

## API overview
- `GET /api/rounds` - list rounds
- `POST /api/rounds` - create a round
- `GET /api/rounds/:roundId` - fetch round
- `PATCH /api/rounds/:roundId` - update round
- `DELETE /api/rounds/:roundId` - delete round
- `GET /api/rounds/:roundId/messages` - list messages
- `POST /api/rounds/:roundId/messages` - send message

## Logs and data
- Logs are written to `logs/` (JSON lines by day).
- Round metadata: `data/rounds.json`
- Messages: `data/messages/{roundId}.json`
