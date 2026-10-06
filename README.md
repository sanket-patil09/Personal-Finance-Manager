# Personal Finance Manager

A full-stack web application for tracking and understanding your personal finances. It has a modern Next.js front end with interactive charts, and an Express + MongoDB back end secured with Clerk authentication.

## Features

- Secure sign-up and sign-in powered by [Clerk](https://clerk.com)
- Dashboard with interactive charts (Highcharts)
- Date selection with a calendar date picker
- Emoji picker for personalising categories
- Light and dark theme support
- Toast notifications for quick feedback
- Clerk webhook handling (via Svix) to keep user data in sync with the database

## Tech Stack

**Frontend**
- Next.js 16 (React 19, TypeScript)
- Tailwind CSS 4, shadcn/ui, Radix UI, Lucide icons
- Highcharts, date-fns, Axios
- Clerk (`@clerk/nextjs`)

**Backend**
- Node.js, Express 5, TypeScript
- MongoDB with Mongoose
- Clerk (`@clerk/express`) and Svix for webhooks
- dotenv, CORS
- localtunnel / ngrok for exposing the local server to webhooks during development

## Project Structure

```
Personal-Finance-Manager/
├── backend/          # Express + TypeScript API
├── frontend/         # Next.js application
├── package.json      # Root dependencies (ngrok)
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- A MongoDB database (local or MongoDB Atlas)
- A free Clerk account and application

### 1. Clone the repository

```bash
git clone https://github.com/sanket-patil09/Personal-Finance-Manager.git
cd Personal-Finance-Manager
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `backend/.env` file (use the variable names your code expects; these are typical examples):

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SIGNING_SECRET=your_clerk_webhook_secret
```

Run the development server:

```bash
npm run dev
```

To build and run for production:

```bash
npm run build
npm start
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `frontend/.env.local` file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Clerk webhooks (optional, for local development)

Clerk needs a public URL to deliver webhooks to your local backend. Expose the backend with a tunnel such as ngrok or localtunnel, then add the public URL plus your webhook route as an endpoint in the Clerk dashboard and copy its signing secret into `backend/.env`.

## Available Scripts

| Location   | Command         | Description                          |
| ---------- | --------------- | ------------------------------------ |
| `backend`  | `npm run dev`   | Start the API with nodemon           |
| `backend`  | `npm run build` | Compile TypeScript to `dist/`        |
| `backend`  | `npm start`     | Run the compiled server              |
| `frontend` | `npm run dev`   | Start the Next.js dev server         |
| `frontend` | `npm run build` | Create a production build            |
| `frontend` | `npm start`     | Serve the production build           |
| `frontend` | `npm run lint`  | Lint the code with ESLint            |

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request

## Author

**Sanket Patil**
GitHub: [@sanket-patil09](https://github.com/sanket-patil09)

## License

No license has been specified yet. Add a `LICENSE` file (for example MIT) to define how others may use this project.
