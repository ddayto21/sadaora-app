# 🔍 Recommendation Platform Overview

This starter app lays the groundwork for a personalized recommendation experience. While the current version focuses on user profiles, interests, and social connections, these features are more than just profile details—they’re structured data points that can be used to surface smarter, more relevant content over time.

For example:

- `Interests` (like “data science” or “entrepreneurship”) can be used to suggest relevant opportunities, people, or posts.

- Following others creates connections that help prioritize content in a user’s feed and form the basis for a lightweight social graph.

As the platform grows, these interactions can inform a recommendation engine—highlighting patterns, surfacing shared goals, and making the experience feel more personalized with every use. None of this is implemented yet, but the data model is designed with that future in mind. Think of it as planting seeds for intelligent discovery and user-driven insights later on.

---

## 🧠 Architectural Decisions

This application is built with a clean separation between the frontend and backend to ensure security, scalability, and maintainability.

- The frontend is built using `React` and `Vite` for fast performance and a simple user experience.
- The backend uses `Node.js`, `Express`, and `PostgreSQL`, with `Prisma` managing database structure and keeping data consistent with the code.

Users sign in with `email` and `password`. The system uses secure authentication methods like hashed passwords and `session tokens` (stored safely in HttpOnly cookies) to protect user data. Access to private routes is restricted to logged-in users only.

Each user has one profile, and sensitive login details are kept separate from public profile information. This approach keeps data secure while allowing flexibility as the platform grows.

The backend is organized into clear layers—routes, middleware, and services—making the system easier to understand, test, and expand. The `frontend` communicates with the `backend` through `REST API calls`, and the interface remains intentionally minimal to keep the experience focused and user-friendly.

---

## 📌 Assumptions Made

• Each user can create multiple `profiles`, and only the authenticated user can edit their own `profiles`.

• The `public feed` displays other users’ `profiles` (not your own) and supports basic pagination.

• User `interests` are stored as a simple list of text, but can be made more flexible if needed later.

• `Profile pictures` are stored as plain URLs. Image uploads (e.g., to S3) are out of scope for now but can be added easily with the current setup.

---

## 📦 Database Schema

This project uses `PostgreSQL` with `Prisma ORM` to define and manage the database structure. The schema is designed to separate private `User` authentication data from public-facing `Profile` information.

### User Table

Stores authentication credentials and core user metadata, including the list of profiles created by that user.

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // hashed
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  profiles  Profile[]
}
```

### Profile Table

Represents individual profiles tied to a user. Each user may own multiple profiles.

```prisma
model Profile {
  id        String   @id @default(uuid())
  name      String
  bio       String?
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId String
  user   User @relation(fields: [userId], references: [id])
}
```

---

## Authentication Workflow

### Signup Flow

- Validate email/password input.
- Hash the password using `bcrypt`.
- Insert user into the `User` table.
- Set a `JWT token` (signed with a secure server `secret`) in an `HTTP-only` cookie.

### Login Flow

- Validate user credentials (email / password).
- Compare password with stored hasth.
- On success, issue JWT token in HTTP-only cooke.

### JWT Validation Middleware

- Extract and verify JWT from cookie.
- Populate request context with authenticated user info for downstream routes.

---

## REST API Endpoints

This REST API supports user authentication and profile management using Node.js, Express, Prisma ORM, and PostgreSQL.

### Authentication Routes

```bash
| Method   | Endpoint    | Description          |
|----------|-------------|----------------------|
| POST     | auth/signup | Register new user    |
| POST     | auth/login  | Login existing user  |
| POST     | auth/logout | Remove cookies       |

```

### Profile Routes

Authenticated routes protected via middleware.

```typescript
GET / profiles;
```

---

## 🛠️ Setup Instructions

This section documents the exact steps I followed to build and configure the application, with the goal of making my implementation process transparent and easy to follow. Each step is explained clearly to provide insight into key decisions, architectural structure, and practical considerations for building a full-stack application using React, Node.js, Prisma, and PostgreSQL. Whether you’re reviewing the system or looking to run it locally, this guide is designed to walk you through it with clarity.

---

### Prerequisites

- `PostgreSQL` (v15) installed and running locally
- `Node.js` (v16+)
- `Vite`, `Prisma`, and `PostgreSQL` client tools

---

### Step 1. Setup PostgreSQL database

Follow these steps to set up PostgreSQL locally:

#### 1.1 Install PostgreSQL

```bash
brew install postgresql
```

---

#### 1.2 Run PostgreSQL instance

After installation, start the `PostgreSQL` service:

```bash
brew services start postgresql@15
```

---

#### 1.3 Connect to PostgreSQL using psql

We use `psql`, the official command-line interface (CLI) tool to connect to PostgreSQL, our relational database system.

```bash
psql postgres
```

This connects us to the default postgres database as our current OS user. For instance, this is the same as the user output from running `whoami`.

---

#### 1.4 Create a new database user

We’ll create a dedicated user for this project to keep things organized and secure.

```sql
CREATE USER sadaora_user WITH PASSWORD 'password'
```

This creates a new `PostgreSQL` role named `sadaora_user` that can later be used to connect our Prisma client to the database system.

---

#### 1.5 Create a new database

Create a new database for the project:

```sql
CREATE DATABASE sadaora;
```

---

#### 1.5 Connect to database with new user

Connect to `sadaora` database as `sadaora_user`:

```bash
psql -U sadaora_user -d sadaora
```

---

#### 1.6 Grant database privileges to user

First, connect to `psql` as a superuser

```bash
psql -U username -d sadaora
```

> The `superuser` account is most likely your default user, which can be retrieved by running the command `whoami` in your terminal.

Run the following`SQL commands` in the sheel to grant privileges to the database user:

```sql
GRANT ALL PRIVILEGES ON SCHEMA public TO sadaora_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sadaora_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sadaora_user;
```

This gives the user full access to use the schema and its tables/sequences.

---

### Step 2: Set up the database tables

We use `Prisma`, an Object-Relational Mapper (ORM) tool used to interact with our `PostgreSQL` database. It will act as a layer between the backend application and the database.

#### 2.1 Set up Prisma ORM

Run this command from the `backend` directory:

```bash
npm install prisma --save-dev
```

This command will accomplish the following:

- Create a `prisma/` directory with a `schema.prisma` file to define our data models.
- Create a `.env` file to store our database credentials.
- Set up the `Prisma Client` configuration.

---

#### 2.2 Configure environment variables for database connection

Edit the `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/sadaora"
JWT_SECRET="your_jwt_secret"
```

> This `.env` file will be automatically loaded when the server starts.

---

#### 2.3 Define models for database tables

We define the shape of our database using Prisma `models`. These models represent the structure of the underlying `database tables` and how they relate to each other.

Update the `prisma/schema.prisma` file to include a `User` and `Profile` model:

---

#### 🧑‍💻 User Model

The `User` model is responsible for managing `authentication-related` data. It stores a user’s `email` and hashed `password`. Each user can have one profile, though creating a profile is optional upon sign-up.

```prisma
model User {
  id       String   @id @default(uuid())
  email    String   @unique
  password String
  profile  Profile?
}
```

- id: Unique identifier for the user (UUID).
- email: Email address used for logging in; must be unique.
- password: Hashed version of user's password.
- profile: (Optional) One-to-one relationship that links a user to thei profile.

---

#### 👤 Profile Model

The `Profile` model stores all `public-facing` information that appears on a user’s `profile page` or in the `public feed`. Each profile is connected to exactly one user via a `foreign key` (`userId`). A user can only have one profile, and vice versa.

```prisma
model Profile {
  id        String     @id @default(uuid())
  userId    String     @unique
  name      String
  bio       String
  headline  String
  photoUrl  String?
  interests Interest[]
  user      User       @relation(fields: [userId], references: [id])
}
```

- **id**: Unique profile ID.
- **userId**: `Foreign key` that links the profile to a specific user.
- **name**: Display name of a user.
- **bio**: A brief paragraph describing the user.
- **headline**: A short title or tagline representing the user.
- **photoUrl**: An optional URL to a profile picture
- **interests**: An array of interests (linked via the Interest model).
  - **user**: Prisma relation that allows navigation from profile to user in queries.

---

#### Interest Model

The `Interest` model represents individual interests or tags (like `“Hiking”` or `“Web3”`). Each interest belongs to a single profile, but a profile can have many interests—forming a one-to-many relationship.

```prisma
model Interest {
  id        String   @id @default(uuid())
  label     String
  profile   Profile  @relation(fields: [profileId], references: [id])
  profileId String
}
```

- **id**: Unique identifier for the interest.
- **label**: The name of the interest or tag (e.g., “AI”, “Baking”).
- **profileId**: Foreign key linking the interest to a specific profile.
- **profile**: Relation field allowing navigation from interest to profile.

---

#### 2.4 Migrate the database schema.

After adding the models, migrate your database using `Prisma Migrate`:

```bash
npx prisma migrate dev --name init
```

- Generates `SQL queries` based on the model definitions.
- Applies those changes to the PostgreSQL database.
- Generates a `Prisma client` designed to interact with the database.

We will be prompted to confirm database creation and Prisma will output SQL statements applied.

---

#### 2.5 Setup Prisma Client

To get started with Prisma Client, first install the @prisma/client package:

```bash
npm install @prisma/client
```

Then, run `prisma generate`, which reads the prisma schema to generate a Prisma client

```bash
npx prisma generate
```

Now, we can import the `PrismaClient` constructor from the `@prisma/client` package to create an instance of Prisma Client to send queries to our database.

---

### Step 3: Implement backend services

These steps are required to build and test backend features like `signup`, `login`, and `profile CRUD`.

---

#### 3.1 Install node dependencies

```bash
npm install --save-dev typescript ts-node @types/node
```

---

#### 3.2 Initialize typescript

```bash
npx tsc --init
```

---

#### 3.3 Update the `tsconfig.json` file with recommended settings

The updated `tsconfig.json` settings optimize TypeScript for a modern Node.js backend by enabling `ES2020 features`, `strict type checking`, and compatibility with Node’s module system. These changes improve code `reliability`, allow clean project structure, and support common development needs like JSON imports and smooth interop with libraries like `Express`.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

---

#### 3.4 Add scripts to configuration file

We update the `package.json` scripts to streamline our development workflow and makes it easier to run / deploy the backend without manually typing commands every time.

```json
"scripts": {
"dev": "ts-node-dev --respawn --transpile-only src/index.ts",
"build": "tsc",
"start": "node dist/index.js"
}
```

---

#### 3.2 Create backend server with express

Install type definitions for node dependencies:

```bash
npm install --save-dev @types/express @types/cors @types/cookie-parser
```

Initialize a node server using express:

```typescript
const app = express();
```

Configure middleware

```typescript
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
```

Run the server on port 3001

```typescript
app.listen(3001, () => {
  console.log("Server is running on port", PORT);
});
```

---

#### 3.3 Create database client

This allows us to import a `databaseClient` wherever database queries are needed.

```typescript
import { PrismaClient } from "@prisma/client";
const databaseClient = new PrismaClient();
export default databaseClient;
```

---

#### 3.4 Create authentication routes

This section explains how to create authentication routes using the `Prisma client`, `bcrypt` for password hashing, and `jsonwebtoken` for issuing secure tokens.

- `/api/auth/signup`: Register a new user
- `/api/auth/login`: Log in an existing user
- `/api/auth/me`: Get the current user based on a token.

First, install the required packages with `node package manager`:

```bash
npm install bcrypt jsonwebtoken dotenv cookie-parser
```

---

#### 3.5 Create profile routes

- `/api/profile`: POST, GET, PUT, DELETE a user profile.
- `/api/feed` GET all profiles excluding the current user.

> Protect these routes with an `authentication` middleware that checks the token.

---

#### 3.6 Test api routes

Use a tool like Postman to test API routes:
• Register a user ➜ verify in DB

• Log in ➜ check JWT cookie

• Create profile ➜ test CRUD

• View feed ➜ confirm profiles returned (excluding own)

Install dependencies for vitest

```bash
npm install --save-dev vitest @vitest/ui
```

---

#### Configure vitest

In the root of backend project, create a `vitest.config.ts` file with the contents:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
});
```

---

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

Frontend will run on http://localhost:5173 and backend on http://localhost:5000.

## Project Structure

```bash
/backend
├── controllers/        # Business logic handlers
├── routes/             # API route definitions
├── models/             # Database models/schemas (if using ORM)
├── middleware/         # Auth, error handling, validation
├── services/           # DB access, file uploads, utility logic
├── config/             # DB config, environment variables
├── index.js            # Main entry point
└── utils/              # JWT, password hashing, etc.
```

## Bonus Ideas (Not implemented)

• Profile “like” and “follow” functionality
• Tag-based filtering in the public feed
• Image upload with S3 and signed URLs

## Step 1: Create frontend application

Create the `frontend` application:

```bash
npm create vite@latest frontend -- --template react-ts
```

Create the `backend` application:

```bash
cd backend
npm init -y
touch index.js
```

```bash
git clone hhttps://github.com/ddayto21/sadaora-app
cd sadaora-app
```
