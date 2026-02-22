# Secure Task Management Dashboard

A full-stack secure task management application built with React, TypeScript, Node.js, Express, MongoDB, and JWT authentication.

All task data is fully protected — no public access is allowed without a valid authentication token.

---

##  Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Figma UI Planning](#figma-ui-palnning)
- [Third-Party Packages](#third-party-packages)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Features](#features)
- [If I Had More Time](#if-i-had-more-time)
- [Day-by-Day Build Plan](#day-by-day-build-plan)

---

## Project Overview

This project was built as part of a Full-Stack Technical Assessment.

The objective was to design and implement a secure, type-safe task management dashboard where:

. Users can register and log in securely

. All backend endpoints require authentication

. Users can manage (create, read, update, delete) their own tasks

. he entire stack is strictly typed using TypeScript

. he UI is responsive, modern, and production-ready

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | Component-based UI |
| TypeScript | 5 | Type safety throughout |
| Vite | 5 | Fast dev server and build tool |
| Tailwind CSS | 4 | Utility-first responsive styling |
| React Router DOM | 6 | Client-side routing |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express | 4 | HTTP server framework |
| TypeScript | 5 | Type safety throughout |
| MongoDB | 7 | NoSQL database |
| Mongoose | 8 | MongoDB object modeling |
| JWT | 9 | Authentication tokens |
| bcrypt | 5 | Password hashing |
| Zod | 3 | Request body validation |

---
## Figma UI Planning
Before implementation, UI wireframes were designed in Figma to plan layout structure, component hierarchy, and user flow.

Figma Design Link
[https://www.figma.com/design/6cXtDUcfyfn1JuwuYAPWjg/Untitled?node-id=0-1&t=Py1N2atCeU510zpK-1]

This planning phase ensured structured component design and smoother frontend development.
---
## Third-Party Packages

- **React Query** — handles all data fetching, caching, and refreshing automatically so we don't have to manually manage loading and error states everywhere.

- **Framer Motion** — adds smooth animations for page transitions and modals, giving the app a polished and professional feel.

- **date-fns** — formats dates in a readable way like "15 Jan 2026, 02:30 PM" and shows relative time like "3 hours ago".

- **React Toastify** — shows small pop-up notifications for success and error feedback without interrupting the user's flow.

- **Zod** — validates all incoming API request data on the backend before it reaches the controller, ensuring clean and safe inputs.

- **Axios** — used instead of fetch because it supports interceptors. We use these to automatically attach the JWT token to every request and handle expired sessions globally.
---

## Folder Structure
```
secure-task-management/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
│
└── README.md
```
---
##  Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB running locally **or** a MongoDB Atlas connection string
- npm or yarn

---

### 1️. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/secure-task-management.git
cd secure-task-management
```
---

### 2️. Setup Backend

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/secure-task-management
JWT_SECRET=your_super_secret_key_minimum_32_characters_long
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend runs on:
```
http://localhost:5000
```

### Swagger API Documentation

Interactive API documentation is available at:

```
http://localhost:5000/api-docs
```

You can:
- View all available endpoints
- Inspect request/response schemas
- Test APIs directly from the browser

---

### 3️. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

### 4️. Open the Application

Visit:

```
http://localhost:5173
```

Then:

- Register a new account
- Log in with your credentials
- Start creating and managing tasks securely

---

## Environment Variables

### Backend `.env`

| Variable | Required | Description |
|-----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign JWT (minimum 32 characters recommended) |
| `FRONTEND_URL` | No | Allowed CORS origin (default: http://localhost:5173) |

---

### Frontend `.env`

| Variable | Required | Description |
|-----------|----------|-------------|
| `VITE_API_BASE_URL` | No | Backend API base URL (default: http://localhost:5000/api) |
---
## Features

- JWT Authentication — register, login, auto logout on expiry  
- Protected Routes — frontend and backend both enforce authentication  
- Task CRUD — create, read, update, delete tasks  
- Task Filters — filter by All, Pending, In Progress, Completed  
- Task Stats — live count of total, completed, pending tasks  
- Due Dates — optional due date per task  
- Ownership Check — users can only see and modify their own tasks  
- Animated UI — smooth page transitions and modal animations  
- Toast Notifications — success and error feedback  
- Responsive Design — works on mobile, tablet, and desktop  
- Type Safe — strict TypeScript on both frontend and backend  
- Request Validation — Zod schemas validate all API inputs  
- Auto Session Management — token expiry handled automatically  
- Swagger API Documentation — interactive API testing available at `/api-docs`  
---
## If I Had More Time

- **Enhanced MongoDB Atlas Configuration** — configure production-ready Atlas setup with proper indexing, monitoring, and environment-based cluster separation.
- **Email Verification & Password Reset** — secure account lifecycle with email-based token flows.
- **Task Pagination & Search** — improve performance and scalability for large task datasets.
- **password reset** — the "forgot password" flow implemented.
- **Role-Based Access** — admin role that can view all users' tasks.
- **Dark Mode** — toggle between light and dark themes.
- **Refresh Token System** — silent token renewal without forcing re-login
---
## Day-by-Day Build Plan

| Day | Focus | Outcome |
|-----|-------|----------|
| Day 1 | Research & Architecture — JWT flow, REST structure, TypeScript patterns | Defined secure API structure and project architecture |
| Day 2 | Figma UI & Backend Setup  — Figma wireframes for Login, Register, Dashboard, Task modal and Task list , Express server, MongoDB connection, Auth routes | Working authentication system and visual frontend blueprint |
| Day 3 | Backend Completion — Task CRUD, middleware, validation, API testing | Fully secure and tested backend |
| Day 4 | Frontend Development — Auth flow, Dashboard UI, Task CRUD integration, React Query, animations | Functional frontend connected to backend with responsive UI |
| Day 5 | Testing & Polish — Error handling, UI improvements, README documentation, Swagger API docs | Production-ready project submission with interactive API documentation |
---
## Author

**Lithika M.** – Full-Stack Developer (Internship Technical Assessment)  

**Tech Stack:** React, TypeScript, Node.js, Express, MongoDB, JWT  

**GitHub:** https://github.com/Lithika04  
**LinkedIn:** https://www.linkedin.com/in/lithika-m-78241a267/  

 Built as part of a full-stack technical assessment to demonstrate secure task management, type-safe architecture, and responsive UI design.
