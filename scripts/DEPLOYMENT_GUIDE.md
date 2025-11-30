# Multi-Version GitHub Pages Deployment Guide

## Overview

This deployment strategy allows you to host two versions of your portfolio simultaneously:
- **V2 (Factory Floor)** at the root: `https://abishek-maharajan.online`
- **V1 (Legacy)** at `/v1`: `https://abishek-maharajan.online/v1`

## Prerequisites

1. Clean git working directory (no uncommitted changes)
2. Both branches exist:
   - `feat/factory-floor` (V2)
   - `release/may-2025-v1` (V1)
3. `pnpm` installed and configured
4. Git push access to the repository

## Quick Start

### Windows (PowerShell)

```powershell
# Run from repository root
.\scripts\deploy-composite.ps1
```

### Linux/Mac (Bash)

```bash
# Make script executable (first time only)
chmod +x scripts/deploy-composite.sh

# Run from repository root
./scripts/deploy-composite.sh
```

## What the Script Does

### Step 1: Build V1 with basePath '/v1'
1. Checks out `release/may-2025-v1` branch
2. Temporarily modifies `next.config.mjs` to add:
   ```javascript
   basePath: "/v1",
   assetPrefix: "/v1",
   ```
3. Runs `pnpm install` and builds the project
4. Copies the `out` directory to a temporary location
5. Restores the original `next.config.mjs`

### Step 2: Build V2 at Root
1. Checks out `feat/factory-floor` branch
2. Runs `pnpm install` and builds the web app
3. Copies `apps/web/out` to a temporary location

### Step 3: Merge Builds
1. Creates a deployment artifact directory
2. Copies V2 build to the root
3. Creates a `v1` subdirectory
4. Copies V1 build into the `v1` subdirectory
5. Adds `.nojekyll` file for GitHub Pages compatibility

### Step 4: Deploy to gh-pages
1. Creates or uses existing `gh-pages` branch
2. Uses git worktree for safe deployment
3. Clears existing content
4. Copies merged builds
5. Commits and pushes to `gh-pages` branch

### Step 5: Cleanup
1. Returns to your original branch
2. Removes all temporary directories
3. Cleans up git worktree

## Verification

After deployment (wait 2-3 minutes for GitHub Pages to rebuild):

1. **V2 (Root)**: Visit `https://abishek-maharajan.online`
   - Should load the new Factory Floor design
   - Check that all assets load correctly
   - Verify navigation works

2. **V1 (Subdirectory)**: Visit `https://abishek-maharajan.online/v1`
   - Should load the legacy May 2025 design
   - All links should work within the `/v1` context
   - Assets should load from `/v1/_next/...`

3. **Browser Console**: Check for any 404 errors or asset loading issues

## Troubleshooting

### Issue: "Working directory is not clean"
**Solution**: Commit or stash your changes before running the script
```bash
git stash
./scripts/deploy-composite.ps1
git stash pop
```

### Issue: V1 links are broken or assets 404
**Cause**: The basePath modification didn't work correctly
**Solution**: 
1. Check `release/may-2025-v1` branch manually
2. Verify `next.config.mjs` structure matches the sed pattern
3. You may need to manually add basePath to the config

### Issue: Script fails during build
**Cause**: Missing dependencies or build errors
**Solution**:
1. Check the error message
2. Try building each version manually:
   ```bash
   git checkout release/may-2025-v1
   pnpm install
   pnpm build
   
   git checkout feat/factory-floor
   pnpm install
   pnpm --filter web build
   ```

### Issue: GitHub Pages not updating
**Cause**: GitHub Pages cache or build delay
**Solution**:
1. Wait 5-10 minutes
2. Check GitHub repository Settings > Pages
3. Verify the source is set to `gh-pages` branch
4. Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Manual Deployment (If Script Fails)

If the automated script fails, you can deploy manually:

### 1. Build V1
```bash
git checkout release/may-2025-v1

# Edit next.config.mjs manually - add these lines after output: "export":
#   basePath: "/v1",
#   assetPrefix: "/v1",

pnpm install
pnpm build  # or pnpm --filter web build

# Copy out directory somewhere safe
cp -r out ../v1_build  # or apps/web/out

# Restore next.config.mjs (git checkout next.config.mjs)
```

### 2. Build V2
```bash
git checkout feat/factory-floor
pnpm install
pnpm --filter web build

# Copy out directory
cp -r apps/web/out ../v2_build
```

### 3. Merge and Deploy
```bash
# Create deployment directory
mkdir ../deploy
cp -r ../v2_build/* ../deploy/
mkdir ../deploy/v1
cp -r ../v1_build/* ../deploy/v1/
touch ../deploy/.nojekyll

# Deploy to gh-pages
git checkout gh-pages
rm -rf *
cp -r ../deploy/* .
git add -A
git commit -m "Deploy: V2 at root, V1 at /v1"
git push origin gh-pages

# Return to your branch
git checkout feat/factory-floor
```

## Architecture Notes

### Why basePath is Required for V1

Next.js generates absolute paths by default. When V1 is served from `/v1`:
- Without basePath: Links point to `/about` (404)
- With basePath: Links point to `/v1/about` (correct)

The `assetPrefix` ensures static assets (_next/static/*) also load from the correct path.

### Directory Structure on gh-pages

```
gh-pages/
├── .nojekyll              # Prevents Jekyll processing
├── index.html             # V2 root page
├── _next/                 # V2 Next.js assets
├── about/                 # V2 pages
├── projects/
└── v1/                    # V1 subdirectory
    ├── index.html         # V1 root page
    ├── _next/             # V1 Next.js assets
    ├── about/             # V1 pages
    └── projects/
```

## GitHub Pages Configuration

Ensure your repository settings are configured:

1. Go to Settings > Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `/ (root)`
4. Custom domain: `abishek-maharajan.online` (if applicable)

## Rollback

To rollback to a previous deployment:

```bash
git checkout gh-pages
git log  # Find the commit hash you want to rollback to
git reset --hard <commit-hash>
git push origin gh-pages --force
```

## Future Improvements

- Add deployment preview before pushing
- Implement blue-green deployment strategy
- Add automated testing before deployment
- Create GitHub Actions workflow for CI/CD
- Add deployment notifications (Slack, Discord, etc.)

## Support

If you encounter issues not covered in this guide:
1. Check the script output for specific error messages
2. Verify both branches build successfully in isolation
3. Check GitHub Pages build logs in the Actions tab
4. Ensure DNS settings are correct for custom domain
