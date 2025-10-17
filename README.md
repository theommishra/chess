## Chess (Full‑Stack WebSocket App)

A simple multiplayer chess app with a TypeScript WebSocket backend and a React + Vite frontend. The frontend connects to the backend over WebSocket to start games and send moves.

### Project Structure

```
e:/chess
  ├─ backend1/        # TypeScript WebSocket server (ws)
  └─ frontend/        # React + Vite client
```

### Prerequisites

- Node.js 18+ and npm

### Quick Start

Open two terminals (or panes) in the repo root.

1) Backend

```
cd backend1
npm install
tsc -b
node dist/index.js
```

- Starts a WebSocket server on `ws://localhost:8080`.

2) Frontend

```
cd frontend
npm install
npm run dev
```

- Vite dev server will print a local URL, typically `http://localhost:5173`.


### Backend Overview

- WebSocket server using `ws` listens on port `8080`.
- Entry: `backend1/src/index.ts`.
- Game orchestration in `backend1/src/GameManager.ts` and `backend1/src/Game.ts`.

WebSocket message types (`backend1/src/messages.ts`):

```
INIT_GAME
MOVE
GAME_OVER
```

Connection lifecycle (`frontend/src/hooks/useSocket.ts`) opens a `WebSocket("ws://localhost:8080")` and cleans up on unmount.

### Frontend Overview

- React + TypeScript + Vite.
- Chess UI in `frontend/src/components/ChessBoard.tsx` and screens in `frontend/src/screens/Game.tsx`.
- Piece images in `frontend/src/pieces/`.

### Development Notes

- Ensure the backend is running before opening the frontend so the WebSocket can connect.
- If you change the backend port, also update `WS_URL` in `frontend/src/hooks/useSocket.ts`.
