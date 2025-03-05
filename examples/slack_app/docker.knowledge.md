# Docker Setup Knowledge

## Docker Configuration

- The project uses Docker and docker-compose for development
- Two Dockerfile configurations:
  - `Dockerfile` - For production builds
  - `Dockerfile.dev` - For development with hot-reloading

## Environment Variables

- Environment variables are loaded from `.env.local`
- Copy `.env.local.example` to `.env.local` to get started
- The `.env.local` file is mounted into the Docker container at runtime

## Development Workflow

- Run `docker-compose up` to start the development environment
- The app will be available at http://localhost:3100
- Changes to the code will trigger hot-reloading
- Node modules are stored in a Docker volume to improve performance

### Hot Reloading Configuration

- The Docker setup is configured for hot reloading with Next.js
- `WATCHPACK_POLLING=true` is set in the environment to ensure file changes are detected
- Port 3101 is exposed for Fast Refresh WebSocket connections
- Volume mounts are configured to preserve node_modules and .next directories while allowing source code changes

## Production Build

To build for production:
```bash
docker build -t nextjs-app .
docker run -p 3100:3000 nextjs-app
```

## Alpine Dependencies

- For Prisma to work correctly in Alpine, use `apk add --no-cache openssl` instead of `openssl1.1-compat`
- The openssl package is required for Prisma's cryptographic operations
- Using `openssl1.1-compat` may cause build failures in newer Alpine versions

## Prisma Setup

- When using Prisma in Docker, the schema file must be copied before running `npm ci`
- The Dockerfile should copy the Prisma schema file separately before installing dependencies:
  ```dockerfile
  # Copy package files
  COPY package.json package-lock.json* ./
  
  # Copy prisma schema first
  COPY prisma/schema.prisma ./prisma/
  
  # Install dependencies
  RUN npm ci
  ```
- This ensures the Prisma client can be generated during the postinstall script
- After copying all files, regenerate the Prisma client to ensure it's up to date:
  ```dockerfile
  # Regenerate Prisma client after copying all files
  RUN npx prisma generate
  ```
