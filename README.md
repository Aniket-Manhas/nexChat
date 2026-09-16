# NexChat

A real-time direct messaging application built with Node.js, Express, MongoDB, Socket.io, and React.

---

## Overview

NexChat enables one-to-one real-time messaging with image attachments, profile customization, online presence indicators, and paginated message history.

**Stack:**

- **Backend** — Node.js, Express 5, MongoDB (Mongoose), Socket.io, JWT, Cloudinary, Multer, Helmet, express-rate-limit
- **Frontend** — React 19, Vite 8, socket.io-client, Lucide React, plain CSS design tokens (no component library dependency)

---

## Project Structure

```
NexChat/
├── backend/          Node.js API server
│   ├── config/       DB connection, Cloudinary, JWT token, rate limiting
│   ├── controllers/  auth, user, message business logic
│   ├── middlewares/  auth guard, multer file handling, error handler
│   ├── models/       User, Conversation, Message schemas
│   ├── routes/       /api/auth, /api/*, /api/message
│   ├── socket/       Socket.io server with room management
│   └── uploads/      Temp local storage before Cloudinary upload
└── frontend/         React + Vite SPA
    └── src/
        ├── components/  Avatar, Sidebar, ChatHeader, MessageList,
        │                MessageInput, NewChatModal, ProfileModal,
        │                ImageLightbox, ProtectedRoutes
        ├── context/     AuthContext, SocketContext, ChatContext, ThemeContext
        ├── pages/       Home (chat workspace), Login, SignUp, NotFound
        └── utils/       api.js (fetch wrapper), format.js (date/time)
```

---

## Local Development

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone and install

```bash
git clone https://github.com/Aniket-Manhas/nexChat.git
cd NexChat

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure backend environment

Copy and fill in the backend environment file:

```bash
cp backend/.env.example backend/.env
```

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/nexchat
JWT_SECRET=your_strong_random_secret_here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Cloudinary (required for image uploads)
cloud_name=your_cloud_name
api_key=your_cloudinary_api_key
api_secret=your_cloudinary_api_secret
```

### 3. Configure frontend environment

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:8000
```

> **Note:** In development the Vite proxy (`/api` → `http://localhost:8000`) handles all API calls, so the `.env` values are only needed for production builds.

### 4. Start servers

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

---

## API Reference

### Auth `POST /api/auth/...`

| Method | Endpoint           | Body                                   | Description                  |
| ------ | ------------------ | -------------------------------------- | ---------------------------- |
| POST   | `/api/auth/signup` | `{ name?, userName, email, password }` | Register new user            |
| POST   | `/api/auth/login`  | `{ login, password }`                  | Login with username or email |
| GET    | `/api/auth/logout` | —                                      | Clear auth cookie            |

### User `GET|PATCH /api/...` _(auth required)_

| Method | Endpoint                    | Description                                             |
| ------ | --------------------------- | ------------------------------------------------------- |
| GET    | `/api/`                     | Get current authenticated user                          |
| GET    | `/api/users?search=<query>` | Search users by name, username, or email                |
| GET    | `/api/conversations`        | List all conversations with last message                |
| PATCH  | `/api/profile`              | Update display name and/or avatar (multipart/form-data) |

### Messages `GET|POST /api/message/:receiverId` _(auth required)_

| Method | Endpoint                 | Query                 | Description                                |
| ------ | ------------------------ | --------------------- | ------------------------------------------ |
| GET    | `/api/message/:receiver` | `?before=<messageId>` | Fetch messages (40 per page, cursor-based) |
| POST   | `/api/message/:receiver` | —                     | Send text and/or image message             |

### WebSocket Events

| Event            | Direction       | Payload          | Description                    |
| ---------------- | --------------- | ---------------- | ------------------------------ |
| `join-chat`      | Client → Server | `receiverId`     | Join shared room with receiver |
| `notification`   | Server → Client | `{ newMessage }` | New message in active room     |
| `getOnlineUsers` | Server → Client | `[userId, ...]`  | Current online user IDs        |

Socket auth: connect with `auth: { token: currentUser._id }`.

---

## Deployment

### Backend — Render / Railway / Fly.io

1. Set all environment variables from `.env.example` in the platform dashboard.
2. Set `NODE_ENV=production`.
3. Set `FRONTEND_URL` to your deployed frontend URL (e.g. `https://nexchat.vercel.app`).
4. Start command: `node index.js`

### Frontend — Vercel / Netlify

1. Build command: `npm run build`
2. Output directory: `dist`
3. Set environment variables:
   - `VITE_API_URL=https://your-backend.onrender.com/api`
   - `VITE_SOCKET_URL=https://your-backend.onrender.com`

### Cross-origin cookie note

For production cross-domain deployments (frontend on Vercel, backend on Render):

- The backend sets `sameSite: 'strict'` and `secure: true` when `NODE_ENV=production`.
- Your frontend domain must use HTTPS.
- The Vite proxy is only active during local development. In production, `VITE_API_URL` must point to the full backend URL.

---

## Features

- **Real-time messaging** — Socket.io room-based delivery, no polling
- **Image attachments** — JPEG, PNG, WebP up to 5 MB, uploaded to Cloudinary
- **Clickable image lightbox** — Full-screen preview with Escape to close
- **Online presence** — Green status dot, "Active now" indicator in chat header
- **Conversation history** — Paginated with cursor-based `?before=` query (40 msgs/page)
- **User search** — Search registered users by name, username, or email to start new DMs
- **Profile management** — Update display name and avatar photo
- **Dark / Light theme** — Persisted in `localStorage`, respects system preference on first visit
- **Security hardening** — Helmet applies HTTP header protections, and the API uses an express rate limiter to throttle repeated requests.
- **Accessible UI** — Semantic HTML, visible focus rings, keyboard-navigable, ARIA labels
- **Responsive layout** — Full mobile view toggling between sidebar and chat pane

---

## Development Notes

- The `uploads/` directory is used as a temporary staging area before files go to Cloudinary. It should be added to `.gitignore` (already configured).
- The backend enables `helmet()` globally to set secure HTTP headers and uses `express-rate-limit` (`limiter`) to restrict excessive requests per IP.
- Message character limit is 250 (enforced both frontend and backend model).
- Allowed image types: `image/jpeg`, `image/png`, `image/webp` — validated on both client and multer middleware.
- The `hooks/auth.js` file is superseded by `context/AuthContext.jsx`. It can be safely removed.

---

## License

MIT
