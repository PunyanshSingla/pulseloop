# PulseLoop 🚀

PulseLoop is a high-performance, real-time poll and feedback platform built for the modern web. It allows creators to build engaging polls with granular control over privacy, mandatory questions, and expiry timing, while providing deep analytical insights through a live dashboard.

## ✨ Features

- **Dynamic Poll Builder**: Create multi-question polls with single-option selections.
- **Mandatory & Optional Questions**: Toggle requirements for each question individually.
- **Smart Privacy Modes**: Support for both **Anonymous** and **Authenticated** responses.
- **Expiry System**: Set start and end times for polls with automatic enforcement.
- **Real-Time Analytics Dashboard**:
  - **Live Pulse**: Instant updates via WebSockets (Socket.io) when votes are cast.
  - **Demographics**: Breakdown by Device, Browser, OS, and Geographic location.
  - **Engagement Metrics**: Completion rates and average time taken.
  - **Identity Analysis**: Stacked breakdown of guest vs. registered user activity.
- **Public Results Publishing**: Creators can choose to publish final results, making them visible to the public via the same poll link.
- **Beautiful UI/UX**: Crafted with Tailwind CSS, Framer Motion, and Recharts for a premium feel.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TanStack Query, Framer Motion, Lucide React, Recharts, Tailwind CSS.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Real-Time**: Socket.io.
- **Auth**: Custom Auth with session-based tracking and browser fingerprinting for guest users.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd pulseloop
   ```

2. **Install Dependencies**
   ```bash
   # Root
   npm install
   
   # Client
   cd client && npm install
   
   # Server
   cd ../server && npm install
   ```

3. **Environment Variables**
   
   Create a `.env` in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pulseloop
   JWT_SECRET=your_secret_here
   CLIENT_URL=http://localhost:5173
   ```

   Create a `.env` in the `client` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   VITE_APP_ORIGIN=http://localhost:5173
   ```

4. **Run Development Servers**

   ```bash
   # Server (from /server)
   npm run dev
   
   # Client (from /client)
   npm run dev
   ```

## 📜 Hackathon Requirements Completion

| Requirement | Status | Implementation Details |
| :--- | :--- | :--- |
| **Poll Creation** | ✅ Complete | Multi-question support with drag-and-drop ordering. |
| **Mandatory Questions** | ✅ Complete | Enforced on both frontend (UI blocks) and backend (API validation). |
| **Anonymous/Auth Modes** | ✅ Complete | Creators can toggle `allowAnonymous`. Backend validates identity requirements. |
| **Expiry System** | ✅ Complete | Automatic blocking of responses after `expiresAt`. Countdown timer for pending polls. |
| **Real-time Updates** | ✅ Complete | Live charts and KPI updates using Socket.io rooms. |
| **Public Results** | ✅ Complete | One-click "Publish Results" feature that converts voting links to insights views. |
| **Fullstack Implementation** | ✅ Complete | Integrated Express API + React Single Page Application. |

## 🛡️ Security & Integrity

- **Fingerprinting**: Prevents duplicate votes from anonymous users using multi-layered browser fingerprinting + IP tracking.
- **Zod Validation**: Strict schema validation for all API inputs.
- **Protected Routes**: Secure dashboard and analytics accessible only to authenticated creators.

---
Built with ❤️ for the Hackathon.
