# Quick Setup Guide

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Configure Environment

The `.env.development` file is already created. You can copy it to `.env` if needed:

```bash
cp .env.development .env
```

Update the values in `.env` with your actual configuration, especially:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A secure random string for JWT signing
- `SMTP_USER` and `SMTP_PASS` - Your email credentials (if using email features)

## Step 3: Set Up Database

Make sure PostgreSQL is running, then:

```bash
# Generate Prisma Client
pnpm run prisma:generate

# Run database migrations
pnpm run prisma:migrate

# (Optional) Open Prisma Studio to view your database
pnpm run prisma:studio
```

## Step 4: Start Development Server

```bash
pnpm run dev
```

The server will start at `http://localhost:3000`

## Step 5: Test the API

Test the health endpoint:

```bash
curl http://localhost:3000/health
```

You should get:

```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2026-04-07T..."
}
```

## Common Issues

### Database Connection Error
- Make sure PostgreSQL is running
- Verify your `DATABASE_URL` in `.env`
- Create the database if it doesn't exist: `createdb school_db`

### Port Already in Use
- Change the `PORT` in `.env` to a different port (e.g., 3001)
- Or kill the process using port 3000:
  - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
  - Mac/Linux: `lsof -ti:3000 | xargs kill -9`

### Prisma Client Not Generated
- Run: `pnpm run prisma:generate`
- If issues persist, delete `node_modules` and reinstall: `pnpm install`

## Next Steps

1. **Update Prisma Schema**: Modify `prisma/schema.prisma` to match your needs
2. **Add Seed Data**: Update `prisma/seed.ts` with initial data
3. **Customize Features**: Modify the feature modules in `src/features/`
4. **Add Tests**: Write tests in the `tests/` directory
5. **Set Up CI/CD**: Configure your preferred CI/CD pipeline

## Available Commands

```bash
# Development
pnpm run dev              # Start dev server with hot reload
pnpm run build            # Build for production
pnpm start                # Start production server

# Database
pnpm run prisma:generate  # Generate Prisma Client
pnpm run prisma:migrate   # Run migrations
pnpm run prisma:studio    # Open Prisma Studio GUI
pnpm run prisma:seed      # Seed database

# Testing
pnpm test                 # Run tests
pnpm run test:watch       # Run tests in watch mode
pnpm run test:coverage    # Run tests with coverage

# Code Quality
pnpm run lint             # Check for linting errors
pnpm run lint:fix         # Fix linting errors
```

## Project Structure

```
backend-template/
├── src/
│   ├── shared/             # Shared utilities, middlewares, config
│   ├── features/         # Feature modules (auth, users, etc.)
│   ├── types/            # TypeScript interfaces and types
│   ├── jobs/             # Background jobs
│   ├── sockets/          # WebSocket handlers
│   ├── app.ts            # Express app configuration
│   └── server.ts         # Entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── tests/                # Test files
├── docs/                 # Documentation
├── logs/                 # Application logs
├── .env.development      # Environment variables
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Check the [docs/API.md](docs/API.md) for API documentation
- Review the Prisma schema at [prisma/schema.prisma](prisma/schema.prisma)
