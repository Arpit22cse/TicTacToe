# TicTacToe — Real-time Multiplayer Game

A full-stack real-time multiplayer tic-tac-toe game with REST APIs and WebSocket-based game rooms. This repository contains a Node/Express backend and a Vite + React + TypeScript frontend.

**Highlights**
- Real-time gameplay using WebSockets
- Authentication and user management
- REST endpoints for game data and items
- Clean React + TypeScript frontend with Tailwind CSS

**Tech stack**
- Backend: Node.js, Express, MongoDB, Mongoose, WebSocket (`ws`)
- Frontend: Vite, React, TypeScript, Tailwind CSS
- Dev tooling: ESLint, Vite

**Repository layout**
- [backend](backend) — Express server, routes, middleware, and WebSocket server
	- Main entry: [backend/index.js](backend/index.js)
	- WebSocket: [backend/websocket/websocket.js](backend/websocket/websocket.js)
	- Routes: [backend/routes](backend/routes)
- [frontend](frontend) — Vite + React + TypeScript app
	- App entry: [frontend/src/main.tsx](frontend/src/main.tsx)
	- Pages & components: [frontend/src](frontend/src)

Getting started
---------------

Prerequisites
- Node.js (v18+ recommended)
- npm

Backend setup
1. Install dependencies and start the server:

```bash
cd backend
npm install
node index.js
```

If you prefer a script, add a `start` script to [backend/package.json](backend/package.json) such as `"start": "node index.js"` and run `npm start`.

Frontend setup
1. Install dependencies and start the dev server:

```bash
cd frontend
npm install
npm run dev
```

Build for production:

```bash
cd frontend
npm run build
```

Environment variables
---------------------
Create a `.env` file in `backend/` (or copy `backend/.env.example`) and set required variables used by the server. The project reads these variables:
- `DATABASE_URI` — MongoDB connection string (used in [backend/config/Database.js](backend/config/Database.js))
- `SECRET_KEY` — JWT signing secret (used across auth routes)
- `COMPANY_MAIL` — SMTP user for nodemailer (optional)
- `COMPANY_PASSWORD` — SMTP password for nodemailer (optional)

There may be additional optional keys depending on your setup (Cloudinary, third-party APIs). Refer to [backend/index.js](backend/index.js) and other files for specifics.

Available scripts
-----------------
- Frontend: `npm run dev`, `npm run build`, `npm run preview` (see [frontend/package.json](frontend/package.json))
- Backend: the project uses `node index.js` as the server entry; you can add npm scripts in [backend/package.json](backend/package.json)

API & WebSocket
---------------
REST routes are in [backend/routes](backend/routes). Below is a short reference for the main endpoints as implemented:

- `GET /users` — test endpoint returning sample users (example data).
- `GET /` — root health endpoint returning a simple message.
- `POST /login` — login with JSON `{ email, password }`. Returns `{ user, token }` and sets an HTTP-only cookie.
- `POST /signin` — register user with JSON `{ username, email, password }`. Returns `{ user, token }` and sets an HTTP-only cookie.
- `GET /getTodos` — (protected) returns the authenticated user's todos; requires Authorization header `Bearer <token>` or cookie.
- `GET /getItems` — returns available items.
- `POST /addItem` — (protected) add an item (uses authentication middleware).
- `POST /addTask` — (protected) add a task for the authenticated user.
- `GET /rooms` — list active rooms.
- `POST /rooms` — create a new room with JSON `{ name }`.
- `POST /rooms/falcon/join` — join a room (implementation expects a room id internally; see code).
- `POST /rooms/random/join` — join any available room.
- `GET /getData` — returns internal room and game state snapshots.
- `POST /instagram/save` — save an Instagram-like user `{ username, password }` to a simple model.
- `POST /sendMail` — send an email via `nodemailer` with `{ name, email, subject, message }`.

WebSocket messages
------------------
The backend hosts a WebSocket server (attached to the same HTTP server). The frontend sends JSON messages; types handled by the server:

- `JOIN_ROOM` — payload `{ roomId, token }` — join a room and initialize or receive the game state.
- `LEAVE_ROOM` — payload `{}` — leave the current room.
- `MAKE_MOVE` — payload `{ index }` — make a move at board cell index `0..8`.

Server-sent message types:

- `GAME_STATE_UPDATE` — payload: full game state (board, currentPlayer, winner, status).
- `PLAYER_LEFT` — notification that the opponent left.
- `ERROR` — payload: error message.

Note: Some route implementations have small inconsistencies (for example `POST /rooms/falcon/join` references a `roomId` param but the route body is not declared as `/:roomId`). If you rely on these endpoints, verify and adapt them in code before production use.

Development notes
-----------------
- The frontend is written in TypeScript and uses Vite for fast HMR.
- The backend uses `mongoose` for MongoDB models located in [backend/models](backend/models).
- Input validation uses `zod` middleware under [backend/middlewares/zod.js](backend/middlewares/zod.js).

Troubleshooting
---------------
- If the frontend cannot reach the backend, confirm the backend server URL and CORS settings in [backend/index.js](backend/index.js).
- Check the console for WebSocket connection errors when joining/creating a room.

Contributing
------------
Contributions are welcome. Please open issues or PRs describing the change. For larger changes, open an issue first to discuss the approach.

License
-------
This project does not include a license file. Add a `LICENSE` at the repository root if you want to declare one.

Contact
-------
If you want help running the project or adding features, open an issue or contact the maintainer listed in the repository metadata.

-----
Generated README updated to provide clear setup and usage instructions for development and deployment.
