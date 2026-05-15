# PulseLoop Server ⚡

The backbone of PulseLoop, providing high-performance APIs, real-time communication, and AI integrations.

## 🚀 Key Features

### 🔐 Authentication & Identity
- **Better-Auth Integration**: Robust session management and security.
- **Provider Support**: Google OAuth and standard Email/Password credentials.
- **Email Service**: Automated verification and password reset flows via Resend.
- **Avatar Management**: Secure image processing and hosting via Cloudinary.

### 📊 Analytics & Data
- **High-Performance Aggregations**: MongoDB pipelines for real-time demographic and engagement metrics.
- **Unique Participant Tracking**: Multi-layered fingerprinting (IP + Browser) to ensure data integrity.
- **Live Pulse**: Socket.io integration for instant data broadcasting to clients.

### 🤖 AI Services
- **Gemini Flash Integration**: High-speed, structured poll generation via Vercel AI SDK.
- **Structured Output**: Enforced JSON schema for AI-generated content.

### 🛡️ Infrastructure
- **Zod Validation**: Strict schema enforcement for all incoming requests.
- **Rate Limiting**: Protection against API abuse and spam submissions.
- **Error Boundary**: Comprehensive logging and standardized error responses.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Auth**: Better-Auth
- **Validation**: Zod
