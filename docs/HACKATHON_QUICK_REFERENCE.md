# 48-Hour Hackathon Quick Reference

**Full Plan**: See `LEARNING_DASHBOARD_48HR_PLAN.md` (1,400+ lines)

## Quick Start Commands

```bash
# Phase 1: Setup (Hours 0-6)
pnpm install
pnpm schema:sync
docker-compose up -d

# Phase 2: Integration (Hours 6-12)
cd apps/api-gateway && pnpm dev
cd apps/web && pnpm dev
pnpm test

# Phase 3: AI Engine (Hours 12-30)
cd apps/ai-engine && python -m app.main
./test-full-stack.sh

# Phase 4: Deploy (Hours 30-48)
docker-compose -f docker-compose.prod.yml up -d
./final-verification.sh
```

## Critical Checkpoints

### Hour 6 Checkpoint

- ✅ Monorepo structure created
- ✅ Golden Schema synchronized
- ✅ Docker services healthy
- ✅ 22 tests still passing

### Hour 12 Checkpoint

- ✅ API Gateway functional
- ✅ Frontend integrated
- ✅ 30 tests passing
- ✅ End-to-end flow working

### Hour 30 Checkpoint

- ✅ AI Engine operational
- ✅ Ingestion working
- ✅ Full stack integrated
- ✅ Golden Dataset verified

### Hour 48 Checkpoint

- ✅ Documentation complete
- ✅ Security hardened
- ✅ Production ready
- ✅ All tests passing

## Emergency Contacts

**Schema Issues**: Run `pnpm schema:sync`  
**Test Failures**: Check `PROGRESS.md`  
**Docker Issues**: Run `docker-compose logs [service]`  
**Integration Issues**: Run `./test-full-stack.sh`

## Key Files

- `docker-compose.yml` - Service orchestration
- `packages/types/src/learning.ts` - Golden Schema (TS)
- `packages/types/python/schemas.py` - Golden Schema (Python)
- `apps/api-gateway/src/routes/analytics.ts` - API endpoints
- `apps/web/src/lib/api-client.ts` - Frontend API client
- `apps/ai-engine/app/services/ingestion.py` - AI ingestion

## Verification Commands

```bash
# Schema sync
pnpm schema:sync

# All tests
pnpm test

# Health checks
curl http://localhost:4000/health
curl http://localhost:8000/health
curl http://localhost:3000

# Full integration
./test-full-stack.sh

# Final verification
./final-verification.sh
```

## Success Metrics

- **Tests**: 30/30 passing (22 existing + 8 new)
- **Schema**: TypeScript ↔ Python synchronized
- **Services**: All healthy
- **Security**: Zero vulnerabilities
- **Performance**: < 500ms API response time

---

**Status**: Ready for 48-hour execution  
**Last Updated**: 2024-11-29
