FROM node:20-alpine

WORKDIR /workspace

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace configuration
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# Copy packages (shared types)
COPY packages ./packages

# Copy web app
COPY apps/web ./apps/web

# Install all dependencies (workspace-aware)
RUN pnpm install --no-frozen-lockfile

# Build shared types package
RUN pnpm --filter @portfolio/types build

# Set working directory to web app
WORKDIR /workspace/apps/web

# Expose port
EXPOSE 3000

# Run the application
CMD ["pnpm", "run", "dev"]
