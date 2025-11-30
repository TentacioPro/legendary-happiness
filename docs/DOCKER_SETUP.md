# Docker Setup Guide

## Prerequisites

- Docker Desktop installed and running
- Docker Compose v2.0+
- At least 4GB RAM allocated to Docker

## Quick Start

1. **Copy environment variables**:
   ```bash
   cp .env.example .env
   ```

2. **Start all services**:
   ```bash
   docker compose up -d
   ```

3. **Check service health**:
   ```bash
   docker compose ps
   ```

4. **View logs**:
   ```bash
   docker compose logs -f
   ```

## Services

### PostgreSQL (Port 5432)
- Database for persistent storage
- Credentials: postgres/postgres
- Database: learning_dashboard

### Redis (Port 6379)
- Caching and session storage
- No authentication in development

### AI Engine (Port 8000)
- Python FastAPI application
- Ingestion toolbelt included:
  - `youtube-transcript-api` - YouTube transcripts
  - `trafilatura` - Web scraping
  - `gitpython` - GitHub repos
  - `pypdf` - PDF extraction
  - `langchain` - AI orchestration

### API Gateway (Port 3001)
- Node.js Express application
- Routes between frontend and AI engine

### Web Frontend (Port 3000)
- Next.js application
- Portfolio and dashboard UI

## Verification

### Check AI Engine
```bash
curl http://localhost:8000/health
```

### Check API Gateway
```bash
curl http://localhost:3001/health
```

### Check Web Frontend
```bash
curl http://localhost:3000
```

## Ingestion Capabilities

The AI Engine is pre-configured with tools for:

1. **YouTube Videos**: Extract transcripts and metadata
2. **Articles**: Scrape and parse web content
3. **GitHub Repos**: Clone and analyze code
4. **PDF Documents**: Extract text and structure
5. **Tweets**: Parse Twitter/X content

## Stopping Services

```bash
docker compose down
```

## Cleaning Up

Remove volumes (WARNING: deletes all data):
```bash
docker compose down -v
```

## Troubleshooting

### Services won't start
```bash
docker compose down
docker compose up -d --build
```

### Check specific service logs
```bash
docker compose logs ai-engine
docker compose logs api-gateway
docker compose logs web
```

### Reset everything
```bash
docker compose down -v
docker system prune -a
docker compose up -d --build
```
