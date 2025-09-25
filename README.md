# 💬 Real-Time Chat App

A **real-time chat application** built with **React (TypeScript)**, **Node.js (Express + Socket.IO)**, and **MongoDB**. This project is a minimal viable product (MVP) that demonstrates **one-to-one messaging**, **JWT authentication**, and **real-time updates** via WebSockets.

---

## ✨ Features

- 🔐 **User Authentication** – Register & Login with JWT.
- 💬 **Real-Time Chat** – Send and receive messages instantly.
- 🗂 **Message Persistence** – Conversations stored in MongoDB.
- 🟢 **Online/Offline Presence** – Basic presence tracking.
- 👤 **Simple UI** – Login, chat list, and conversation screen.

---

## 🛠 Tech Stack

**Frontend (React + TypeScript + Vite):**
- React 18 + TypeScript
- Vite
- Axios (API requests)
- Socket.IO Client
- Context API (state management)

**Backend (Node.js + Express + Socket.IO):**
- Node.js + Express
- TypeScript
- Socket.IO
- JWT Authentication
- MongoDB + Mongoose ODM

---

## 📂 Project Structure

```
chat-app/
├── README.md
├── backend/                    # Node.js + Express + Socket.IO + MongoDB
│   └── src/
│       ├── server.js
│       ├── config/db.js
│       ├── models/            # User, Message
│       ├── routes/            # authRoutes, messageRoutes
│       ├── controllers/
│       ├── sockets/
│       └── utils/
│
└── frontend/                   # React + TypeScript + Vite
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api/
        ├── components/
        ├── pages/
        ├── context/
        ├── hooks/
        ├── services/
        ├── types/
        └── styles/
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill `.env` with your values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=supersecretkey
```

Run backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- Frontend → http://localhost:5173
- Backend API → http://localhost:5000

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` → Register new user
- `POST /api/auth/login` → Login & receive JWT

### Messages
- `GET /api/messages/:userId` → Fetch messages with a specific user
- `POST /api/messages` → Send a new message

---

## 🔌 WebSocket Events

| Event            | Payload Example                        | Description             |
|------------------|----------------------------------------|-------------------------|
| `send_message`   | `{ sender, receiver, content }`       | Send message            |
| `receive_message`| `{ sender, content }`                 | Receive message         |
| `typing`         | `{ from, to }`                        | Typing indicator        |
| `disconnect`     | –                                     | User disconnects        |