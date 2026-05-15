# PulseLoop 🚀

PulseLoop is a premium, real-time polling and analytics platform designed for high engagement and deep data insights. It features a sophisticated dashboard, AI-driven poll generation, and robust response tracking for both anonymous and authenticated users.

## ✨ Core Features

### 📊 Advanced Analytics Dashboard
- **Real-Time KPIs**: Live tracking of Total Responses, Active Polls, Completion Rates, and Avg. Time Taken with period-over-period growth metrics.
- **Engagement Charts**: Interactive "Responses Over Time" stacked area charts showing participation trends.
- **User Breakdown**: Visual pie charts differentiating between **Logged-in** and **Anonymous** participants.
- **Platform Analytics**: Granular distribution data for Devices, Browsers, and Operating Systems.
- **Live Activity Feed**: A real-time stream of platform events using WebSockets.
- **Top Poll Spotlight**: Automatic identification and performance highlighting of trending polls.

### 📝 Dynamic Poll Ecosystem
- **Multi-Question Builder**: Create complex polls with multiple questions in a single flow.
- **Smart Validation**: Individual "Mandatory" toggles for every question to ensure critical data collection.
- **Expiry & Scheduling**: Precise control over poll start/end times with automatic status transitions (Running, Scheduled, Ended).
- **Privacy Controls**: Toggle between Public/Private visibility and enable/disable Anonymous participation.
- **Public Results**: One-click publishing to share live analytics with the public via dedicated URLs.

### 🗳️ Premium Voting Experience
- **Step-by-Step Flow**: A focused, distraction-free voting interface with a real-time progress indicator.
- **Universal Participation**: Seamless voting for guest users via **Unique Voter Identification** to prevent duplicate votes without requiring login.
- **Interactive Feedback**: Smooth animations using Framer Motion and celebration effects (Confetti) upon submission.
- **Live Updates**: Results pages update instantly as new votes are cast without requiring a refresh.

### 🤖 AI-Powered Capabilities
- **Gemini AI Integration**: Generate professional-grade polls, questions, and balanced options from a single prompt.
- **Structured Generation**: Context-aware content generation to speed up the creation process.

### 🔐 Security & Identity
- **Better-Auth Integration**: Secure session management with multi-provider support.
- **Social Login**: Full support for **Google OAuth** for quick onboarding.
- **Account Management**: Profile customization with Cloudinary-backed avatar uploads and secure password reset flows.
- **Email Verification**: Built-in verification flow to ensure high-quality user accounts.

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, TanStack Query, Framer Motion, Recharts, shadcn/ui, Tailwind CSS (v4) |
| **Backend** | Node.js, Express, MongoDB (Mongoose), Socket.io |
| **Auth** | Better-Auth (MongoDB Adapter), Google OAuth |
| **Services** | Resend (Email), Cloudinary (Media), Google Gemini AI (AI SDK) |
| **Validation** | Zod (End-to-end schema validation) |

## 🚀 Installation & Setup

### 1. Prerequisites
- Node.js v18+
- MongoDB instance (Local or Atlas)
- pnpm (Recommended)

### 2. Project Initialization
```bash
# Clone the repository
git clone <repo-url>
cd pulseloop

# Setup Client
cd client && pnpm install

# Setup Server
cd ../server && pnpm install
```

### 3. Environment Configuration
**Server (.env)**:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_uri
DATABASE_NAME=pulseloop

# Better-Auth
BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_secret

# Social & AI
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_GENERATIVE_AI_API_KEY=...

# Email & Media
RESEND_API_KEY=...
EMAIL_FROM=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**Client (.env)**:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_ORIGIN=http://localhost:5173
```

### 4. Running the Project
```bash
# Run Backend (from /server)
pnpm run dev

# Run Frontend (from /client)
pnpm run dev
```

---
Built with ❤️ by Punyansh Singla