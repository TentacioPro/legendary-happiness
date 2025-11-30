# Quick Deploy Reference

## One-Command Deployment

### Windows (PowerShell)
```powershell
.\scripts\deploy-composite.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x scripts/deploy-composite.sh && ./scripts/deploy-composite.sh
```

## Pre-Flight Checklist

- [ ] Working directory is clean (`git status` shows no changes)
- [ ] You're on `feat/factory-floor` branch
- [ ] `pnpm` is installed
- [ ] You have push access to the repository

## What Happens

1. ✅ Builds V1 with `/v1` basePath
2. ✅ Builds V2 at root
3. ✅ Merges both builds
4. ✅ Deploys to `gh-pages` branch
5. ✅ Returns you to your original branch

## Expected Duration

- **Total Time**: 5-10 minutes
- V1 Build: 2-3 minutes
- V2 Build: 2-3 minutes
- Deploy: 1-2 minutes
- GitHub Pages Rebuild: 2-3 minutes

## Verification URLs

After deployment completes, wait 2-3 minutes then check:

- **V2 (New)**: https://abishek-maharajan.online
- **V1 (Legacy)**: https://abishek-maharajan.online/v1

## Common Issues

| Issue | Quick Fix |
|-------|-----------|
| "Working directory not clean" | `git stash` before running |
| Script permission denied (Mac/Linux) | `chmod +x scripts/deploy-composite.sh` |
| Build fails | Check error message, try manual build |
| Pages not updating | Wait 5-10 minutes, hard refresh browser |

## Need Help?

See `scripts/DEPLOYMENT_GUIDE.md` for detailed documentation.
