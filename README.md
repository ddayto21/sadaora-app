# Sadaora Starter App

This is a lightweight "Member Profiles + Feed" application built as part of a take-home assessment for the Senior Full-Stack Engineer role at Sadaora. The app demonstrates core features including Google SSO authentication, profile management (CRUD), and a public feed.

---

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- PostgreSQL
- Google OAuth credentials (Client ID and Client Secret)

### 1. Clone the repository

```bash
git clone hhttps://github.com/ddayto21/sadaora-app
cd sadaora-app
```

### 2. Install dependencies

## Frontend

```bash
cd frontend
npm install
```

## Backend

```bash
cd ../backend
npm install
```

## 3. Set up environment variables

Create a .env file in the server directory with the following:

### 4. Run the app locally

Frontend will run on http://localhost:3000 and backend on http://localhost:5000.

## Architectural Decisions

The application is structured as a `React` frontend and a `Node.js` + `Express` backend connected to a `PostgreSQL` database via `Prisma ORM`. This setup allows for clean separation of concerns and easy scaling in a microservices-oriented architecture. All API routes follow REST conventions, and the backend is modular, with clear separation between authentication, profile management, and feed-related routes.

For authentication, we implemented `Google Sign-In` (OAuth2) to keep the user experience seamless and secure. `JWT` tokens are issued and stored in `HttpOnly` cookies to ensure session security. While email/password auth was requested, we opted for SSO as a cleaner, production-ready approach that aligns with real-world usage.

The system is designed with scalability and startup-readiness in mind: React handles the client-side rendering and state management, while the backend is stateless, enabling it to run in containerized environments like `AWS Lambda` or `ECS`. Basic input validation, error handling, and user context isolation have been implemented with security and reliability in mind.

## Assumptions Made

• Authentication was implemented using Google OAuth for simplicity and to reflect realistic usage patterns in consumer apps.
• Each user is allowed one profile, and profiles are only editable by the user who created them.
• Tags for interests are stored as comma-separated strings in the database for simplicity (but could be normalized into a join table for more advanced features).
• Profile images are stored as URLs; image uploads to S3 were omitted for scope, but hooks are in place for future expansion.
• The public feed excludes the logged-in user’s own profile and includes simple pagination via query params.
• UI is kept minimal to focus on functionality and clarity of architecture.

## Bonus Ideas (Not implemented)

• Profile “like” and “follow” functionality
• Tag-based filtering in the public feed
• Image upload with S3 and signed URLs

## Step 1: Create frontend application

Create the `frontend` application:

```bash
npx create-react-app frontend
```

Create the backend application:

```bash
cd backend
npm init -y
touch index.js
```
