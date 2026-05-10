<<<<<<< HEAD
# Library Management System

> ⚠️ **ATTENTION:** There are 2 issues that need your action. See [NEXT_STEPS.md](NEXT_STEPS.md) for instructions.

A full-stack library management system with React frontend and Express backend.

## 🚨 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Backend Server | ⚠️ Needs Restart | Required for `/add-book` endpoint |
| Frontend | ✅ Running | All UI components working |
| Database | ⚠️ Needs Check | "Book not found" issue |
| Authentication | ✅ Working | Admin & student login |

**Quick Fix:** Run `cd backend && restart-server.bat` then `diagnose.bat`

📖 **See:** [NEXT_STEPS.md](NEXT_STEPS.md) for step-by-step instructions

---

# Library Management System

## Project Structure

```
├── backend/          # Express.js backend server
│   ├── server.js     # Main server file with API endpoints
│   ├── db.js         # MySQL database connection
│   └── package.json
│
└── frontend/         # React + TypeScript frontend (TanStack Router)
    ├── src/
    │   ├── routes/   # Application routes
    │   ├── lib/      # Utilities and API client
    │   │   ├── api.ts          # Backend API service
    │   │   └── auth-backend.tsx # Authentication context
    │   └── components/
    └── package.json
```

## Features

- **Authentication**: Login system for admins and students
- **Book Management**: View and manage library books
- **Student Management**: Register and manage student accounts
- **Loan Tracking**: Issue books and track returns
- **Dashboard**: Personalized dashboards for students and admins

## Backend API Endpoints

### Authentication
- `POST /login` - User login (admin/student)

### Books
- `GET /doc` - Get all books

### Students
- `GET /students` - Get all students
- `POST /register-user` - Register new student

### Transactions
- `GET /transactions` - Get all transactions
- `GET /student-transactions/:userId` - Get transactions for specific student
- `POST /issue-book` - Issue a book to a student

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn

### 1. Database Setup

Create a MySQL database and import your schema with these tables:
- `authentication_system` - User credentials
- `staff` - Admin users
- `readers` - Student users
- `books` - Book catalog
- `transactions` - Book loans

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure your database connection in `backend/db.js`:
```javascript
const connection = mysql.createConnection({
  host: "localhost",
  user: "your_username",
  password: "your_password",
  database: "your_database"
});
```

Start the backend server:
```bash
npm start
# or
node server.js
```

Server will run on `http://localhost:5500`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

The frontend is already configured to connect to `http://localhost:5500` via the `.env` file.

For development:
```bash
npm run dev
```

For production build:
```bash
npm run build
```

The build output will be in `frontend/dist/` which the backend serves automatically.

### 4. Running the Full Application

**Option 1: Development Mode**
1. Start backend: `cd backend && npm start`
2. Start frontend dev server: `cd frontend && npm run dev`
3. Access frontend at `http://localhost:5173` (Vite dev server)

**Option 2: Production Mode**
1. Build frontend: `cd frontend && npm run build`
2. Start backend: `cd backend && npm start`
3. Access application at `http://localhost:5500` (backend serves built frontend)

## Frontend-Backend Integration

The frontend connects to the backend through the API service located at `frontend/src/lib/api.ts`.

### Using the API in Components

```typescript
import { api } from '@/lib/api';

// Login
const response = await api.auth.login(username, password);

// Get all books
const books = await api.books.getAll();

// Get student transactions
const transactions = await api.transactions.getByUserId(userId);

// Issue a book
await api.transactions.issueBook({
  userId: 'U001',
  studentName: 'John Doe',
  authNo: 'BK001',
  issue_date: '2024-01-01',
  due_date: '2024-01-15'
});
```

### Authentication

The app uses a custom authentication context (`auth-backend.tsx`) that:
- Stores user session in `sessionStorage`
- Provides `useAuth()` hook for components
- Handles login/logout functionality

```typescript
import { useAuth } from '@/lib/auth-backend';

function MyComponent() {
  const { user, role, loading, login, logout } = useAuth();
  
  // Use authentication state
}
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5500
```

## Tech Stack

### Frontend
- React 18
- TypeScript
- TanStack Router (file-based routing)
- Tailwind CSS
- shadcn/ui components
- Vite

### Backend
- Node.js
- Express.js
- MySQL
- CORS enabled

## Default Users

Configure these in your database:
- **Admin**: Check `staff` table
- **Student**: Check `readers` table

## Development Notes

- Backend runs on port 5500
- Frontend dev server runs on port 5173 (Vite default)
- CORS is enabled for development
- Session data stored in browser sessionStorage
- API calls use fetch with JSON

## Troubleshooting

### Quick Diagnostics

```bash
cd backend
diagnose.bat
```

This will check:
- Database structure and data
- All API endpoints
- Server status

### Common Issues

**1. 404 Error on Add Book**
- Solution: Restart server with `restart-server.bat`
- See: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**2. "Book not found" Error**
- Solution: Run `check-database.js` to verify column names
- See: [CURRENT_ISSUES.md](CURRENT_ISSUES.md)

**3. CORS Issues**
- Make sure backend has `cors()` middleware enabled

**4. Database Connection**
- Verify MySQL credentials in `backend/db.js`

**5. Port Conflicts**
- Change port in `backend/server.js` if 5500 is in use

**6. Build Issues**
- Clear `node_modules` and reinstall dependencies

### Diagnostic Tools

| Tool | Purpose |
|------|---------|
| `restart-server.bat` | Safely restart backend |
| `diagnose.bat` | Run all diagnostics |
| `check-database.js` | Check database structure |
| `test-endpoints.js` | Test all API endpoints |

### Documentation

- 📘 [NEXT_STEPS.md](NEXT_STEPS.md) - What to do next
- 📗 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Detailed solutions
- 📙 [CURRENT_ISSUES.md](CURRENT_ISSUES.md) - Active issues
- 📕 [SERVER_STATUS.md](SERVER_STATUS.md) - Server diagnostics
- 📓 [backend/README.md](backend/README.md) - API documentation

## Troubleshooting

**CORS Issues**: Make sure backend has `cors()` middleware enabled

**Database Connection**: Verify MySQL credentials in `backend/db.js`

**Port Conflicts**: Change port in `backend/server.js` if 5500 is in use

**Build Issues**: Clear `node_modules` and reinstall dependencies

## License

MIT
=======
# LMS
Library Management System
>>>>>>> e11cc660b305791098b04f770536bf50a71e61da
