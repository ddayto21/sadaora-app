# Sadaora Starter App

This project is a lightweight `Member Profiles` + `Public Feed` application built for the Senior Full-Stack Engineer take-home assessment at `Sadaora`. It demonstrates core functionality including secure `user authentication`, `profile creation` and `management` (`CRUD`), and a `public feed` of `user profiles`. The goal is to highlight clean architecture, thoughtful API design, and a well-organized full-stack implementation.

---

## 🧠 Architectural Decisions

The application is built with a clear separation between the `frontend` and `backend`. The `frontend` is developed using `React` with `Vite`, while the backend runs on `Node.js` with `Express`, connected to a `PostgreSQL` database through `Prisma`, a tool that simplifies database management and ensures consistency between data models and code.

`Users` authenticate using a secure `email` and `password` flow. When users log in, the server generates a `JWT` (JSON Web Token), which is stored in an `HttpOnly` cookie—this keeps the session secure and reduces the risk of attacks. `Passwords` are safely hashed, and access to protected routes is restricted through `middleware` that checks for valid authentication.

The architecture separates `private login information` from `public-facing user data`. Each user has exactly one `profile`, and this connection is maintained through a `shared ID` between the two tables. This design keeps sensitive credentials secure and makes it easy to expand the system as new features are introduced.

On the backend, the code is organized into clear layers: `routes` handle incoming requests, `middleware` takes care of authentication and error handling, and `services` manage all communication with the database. The `frontend` connects to the `backend` through simple API calls, using `fetch` to send and receive data. The UI is intentionally minimal to keep the experience focused and easy to use.

---

## 📌 Assumptions Made

• Each user has exactly one `profile`, and the profile can only be created or edited by the logged-in user.

• `Profile pictures` are stored as `plain URLs`; image uploads (e.g. to S3) are excluded for scope but can be added easily using the existing schema.

• The `public feed` shows other users’ profiles, not the currently logged-in user. It supports basic pagination.

• The frontend design is minimal and focused on `functionality`, not visual polish.

• API routes are open by default and are only protected when using `authentication middleware` that checks for a valid `session token`.

• `Prisma` is used for schema definition, data querying, and automatic migration generation for a smoother developer experience.

• UUIDs are used as unique identifiers to keep the system scalable and secure.

• `User interests` are stored as a simple list of text, but can be made more flexible if needed later.

---

## 📦 Database Schema Design

This project uses `PostgreSQL` with `Prisma ORM` to define and manage the database structure. The schema is designed to separate `user authentication` data from user-facing `profile information`. This helps keep sensitive data secure and the database clean and easy to extend later.

The `User` table stores essential login details like the user’s email, hashed password, and a unique id. This table is only responsible for authentication and user identity—it doesn’t store public-facing data like a bio or profile picture. Each user can optionally have one profile, which is represented as a one-to-one relationship with the Profile table.

The `Profile` table stores all public information about a user, such as their name, bio, headline, photoUrl, and list of interests. It has a userId field, which acts as a foreign key—this means it links back to a specific id in the User table. This creates a one-to-one relationship, where each profile is connected to exactly one user, and each user can have at most one profile.

This structure follows best practices for relational databases: it keeps sensitive data (like passwords) isolated, makes relationships between users and their profiles clear, and supports future features like likes, follows, or tags without major changes to the core schema.

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

#### 2.1 Initialize Prisma in the backend

Run this command from the `backend` directory:

```bash
npx prisma init
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

- **DATABASE_URL**: Connects `Prisma` to our local `PostgreSQL` database.
- **JWT_SECRET**: Used by the backend to sign and verify `authentication tokens`.

> This `.env` file will be automatically loaded when the server starts.

---

#### 2.3 Define models for database tables

We define the shape of our database using Prisma `models`. These models represent the structure of the underlying `database tables` and how they relate to each other.

Open the file located at `prisma/schema.prisma` and replace its contents with the following model definitions:

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

The `Profile` model stores all `public-facing` information that appears on a user’s pr`ofile pag`e or in the `public feed`. Each profile is connected to exactly one user via a `foreign key` (`userId`). A user can only have one profile, and vice versa.

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

#### 2.4 Create and apply database migration

Once our models are defined, we run the following command to accomplish the following tasks:

- Generate `SQL queries` based on the model definitions.
- Apply those changes to the PostgreSQL database.
- Generate a `Prisma client` designed to interact with the database.

```bash
npx prisma migrate dev --name init
```

Install the Prisma CLI as the project:

```bash
npm install prisma --save-dev
```

We will be prompted to confirm database creation and Prisma will output SQL statements applied.

---

#### 2.5 Generate prisma client

Run `prisma generate` to create the prisma client based on the `prisma/schema.prisma` file.

```bash
npx prisma generate
```

- Reads the `schema.prisma` file.
- Generates the `Prisma Client` code inside `node_modules/@prisma/client`
- Updates types and query methods based on our schema.

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
