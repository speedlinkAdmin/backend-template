# Backend Template

A TypeScript backend template with feature-based architecture, built with Express.js and Prisma ORM.

## 🚀 Features

- **TypeScript** - Full type safety
- **Feature-based Architecture** - Organized by business domain
- **Prisma ORM** - Type-safe database queries
- **Authentication** - JWT-based auth with role-based access control
- **Validation** - Request validation with express-validator
- **Error Handling** - Centralized error handling
- **Logging** - Winston logger with file and console transports
- **Rate Limiting** - API rate limiting
- **Socket.IO** - Real-time communication support
- **Testing** - Jest setup with TypeScript support
- **Docker** - Containerized deployment ready

## 📁 Project Structure

```
src/
├── shared/                  # Shared across features
│   ├── config/             # Database, environment, logger
│   ├── middlewares/        # Auth, error, validation, rate limiter
│   ├── utils/              # Helper functions and utilities
│   ├── validations/        # Shared validation schemas
│   └── services/           # Shared services (email, etc.)
│
├── features/               # Core business logic
│   ├── auth/              # Authentication & authorization
│   ├── users/             # User management
│   ├── classes/           # Class management
│   ├── attendance/        # Attendance tracking
│   ├── grades/            # Grade management
│   ├── notifications/     # Notification system
│   └── admin/             # Admin dashboard
│
├── types/                  # TypeScript interfaces and types
├── jobs/                   # Background tasks
├── sockets/                # WebSocket handlers
├── app.ts                  # Express app setup
└── server.ts               # Entry point
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend-template
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.development .env
```

Edit `.env` and update the database connection string and other configurations.

4. Set up the database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed the database
npm run prisma:seed
```

5. Start the development server:
```bash
npm run dev
```

The server will start at `http://localhost:3000`

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed the database

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)

### Classes
- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID
- `POST /api/classes` - Create class (Admin/Teacher)
- `PATCH /api/classes/:id` - Update class (Admin/Teacher)
- `DELETE /api/classes/:id` - Delete class (Admin)

### Attendance
- `GET /api/attendance/class/:classId` - Get attendance by class
- `POST /api/attendance` - Mark attendance (Teacher)
- `PATCH /api/attendance/:id` - Update attendance (Teacher)

### Grades
- `GET /api/grades/student/:studentId` - Get student grades
- `POST /api/grades` - Create grade (Teacher/Admin)
- `PATCH /api/grades/:id` - Update grade (Teacher/Admin)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `POST /api/notifications` - Send notification

### Admin
- `GET /api/admin/stats` - Get dashboard stats (Admin)
- `GET /api/admin/activities` - Get recent activities (Admin)

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## 🐳 Docker

Build the Docker image:
```bash
docker build -t backend-template .
```

Run the container:
```bash
docker run -p 3000:3000 --env-file .env backend-template
```

## 📊 Database

This project uses Prisma ORM with PostgreSQL. The schema is located at `prisma/schema.prisma`.

To view and edit your database, use Prisma Studio:
```bash
npm run prisma:studio
```

## 🔒 Security

- JWT authentication with role-based access control
- Password hashing with bcrypt
- Rate limiting on API routes
- Helmet for HTTP security headers
- CORS configuration
- Input validation on all endpoints

## 📝 Environment Variables

See `.env.development` for all available environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
