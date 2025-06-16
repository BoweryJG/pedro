# Dr. Pedro Advanced Dental Practice - Full Stack Application

A modern, AI-powered dental practice platform featuring an intelligent chatbot assistant, integrated smile simulation technology, and comprehensive patient management system.

## 🏗️ Architecture

This monorepo contains both frontend and backend applications:

- **Frontend**: React/TypeScript application with Vite, deployed on Netlify
- **Backend**: Supabase-based API with PostgreSQL, deployed on Render

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Supabase CLI (for backend development)

### Installation

```bash
# Clone the repository
git clone https://github.com/BoweryJG/pedro.git
cd pedro

# Install all dependencies
npm install
```

### Development

```bash
# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend

# Run both frontend and backend concurrently
npm run dev:all
```

### Build

```bash
# Build both frontend and backend
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
```

## 📁 Project Structure

```
pedro/
├── frontend/               # React frontend application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   ├── netlify/           # Netlify serverless functions
│   └── package.json       # Frontend dependencies
├── backend/               # Supabase backend
│   ├── supabase/          # Database migrations & functions
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
├── package.json           # Root workspace configuration
└── README.md             # This file
```

## 🔧 Environment Variables

### Frontend (.env in /frontend)
```
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_API_URL=https://pedrobackend.onrender.com
```

### Backend (.env in /backend)
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🌐 Deployment

### Frontend (Netlify)
- Automatically deploys from the `frontend/` directory
- Build command: `cd frontend && npm run build`
- Publish directory: `frontend/dist`

### Backend (Render)
- Automatically deploys from the `backend/` directory
- Build command: `cd backend && npm install && npm run build`
- Start command: `cd backend && npm start`

## 🔗 Live URLs

- **Frontend**: https://pedrodental.netlify.app (or your custom domain)
- **Backend**: https://pedrobackend.onrender.com

## 📋 Features

- 🤖 AI-powered chatbot assistant
- 🦷 Yomi robotic surgery information
- 😊 TMJ treatment details
- ✨ EMFACE procedures
- 📅 Appointment scheduling
- 👨‍⚕️ Staff profiles
- ⭐ Patient testimonials
- 🔒 Secure authentication

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Material-UI
- Framer Motion
- Zustand

### Backend
- Supabase
- PostgreSQL
- Deno Edge Functions
- Node.js

## 📄 License

This project is proprietary software for Dr. Pedro's dental practice.