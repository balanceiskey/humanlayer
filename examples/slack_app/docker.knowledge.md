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
- The app will be available at http://localhost:3000
- Changes to the code will trigger hot-reloading
- Node modules are stored in a Docker volume to improve performance

### Hot Reloading Configuration

- The Docker setup is configured for hot reloading with Next.js
- `WATCHPACK_POLLING=true` is set in the environment to ensure file changes are detected
- Port 3001 is exposed for Fast Refresh WebSocket connections
- Volume mounts are configured to preserve node_modules and .next directories while allowing source code changes

## Production Build

To build for production:
```bash
docker build -t nextjs-app .
docker run -p 3000:3000 nextjs-app
```
