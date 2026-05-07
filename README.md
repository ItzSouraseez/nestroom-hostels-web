# 🏠 NestRoom — Modern Hostel Management Ecosystem

NestRoom is a high-performance, real-time management platform designed to streamline hostel operations and enhance the resident experience. Built with a focus on speed, aesthetics, and reliability, it bridges the gap between administrators and residents through instant communication and automated workflows.

## 🚀 Key Features

### 📡 Real-Time Infrastructure
- **Event-Driven Updates**: Powered by **Socket.io**, the platform provides instant synchronization for attendance checks, complaints, and notifications without manual refreshes.
- **Push Notifications**: Full integration with the **Web Push API** for native browser alerts, ensuring residents never miss an important announcement or payment deadline.
- **Smart Fallbacks**: Hybrid architecture that combines WebSocket efficiency with robust 10-second polling fail-safes for critical modules.

### 🍱 Resident Experience
- **Premium Dashboard**: A state-of-the-art overview featuring glassmorphism design, animated status indicators, and live data feeds.
- **Digital Notice Board**: A scrollable, real-time announcement center with custom sleek scrollbars for a desktop-class experience.
- **Self-Service Portal**: Automated rent payments via Razorpay, instant leave applications, and a real-time support center for raising grievances.

### 🛡️ Core Security & Performance
- **JWT-Based Authentication**: Secure session management with encrypted token storage.
- **Geofenced Attendance**: High-accuracy location verification for residents during administrative checks.
- **Optimized Assets**: Dynamic image optimization via Cloudinary and modern typography (Outfit/Inter).

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+, Vanilla CSS Modules
- **Real-time**: Socket.io-client
- **Notifications**: Web-Push, Service Workers
- **State Management**: React Context & Hooks
- **Icons & UI**: Lucide React, CSS Animations

## 🚦 Getting Started

### Prerequisites
- Node.js 18.x or higher
- A running instance of the [NestRoom Backend](https://github.com/ItzSouraseez/nestroom-hostels-backend)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ItzSouraseez/nestroom-hostels-web.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
   ```
4. Launch the development server:
   ```bash
   npm run dev
   ```

## 📱 Service Worker & PWA
The application includes a custom Service Worker (`public/sw.js`) that handles background push notifications and notification click interactions, ensuring engagement even when the tab is closed.

---
*Built with ❤️ for better hostel living.*
