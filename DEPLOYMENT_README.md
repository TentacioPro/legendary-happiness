# Multi-Version GitHub Pages Deployment

## 🎯 Goal

Deploy two versions of your portfolio simultaneously:
- **V2 (Factory Floor)** → Root: `https://abishek-maharajan.online`
- **V1 (May 2025)** → Subdirectory: `https://abishek-maharajan.online/v1`

## 🚀 Quick Start

### Step 1: Run Deployment Script

**Windows (PowerShell):**
```powershell
.\scripts\deploy-composite.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x scripts/deploy-composite.sh
./scripts/deploy-composite.sh
```

### Step 2: Wait for GitHub Pages

Wait 2-3 minutes for GitHub Pages to rebuild.

### Step 3: Verify Deployment

```powershell
.\scripts\verify-deployment.ps1
```

Or manually visit:
- https://abishek-maharajan.online (V2)
- https://abishek-maharajan.online/v1 (V1)

## 📋 Pre-Deployment Checklist

Before running the deployment script, ensure:

- [ ] Working directory is clean (`git status`)
- [ ] Currently on `feat/factory-floor` branch
- [ ] `pnpm` is installed and working
- [ ] You have push access to the repository
- [ ] Both branches exist:
  - [ ] `feat/factory-floor` (V2)
  - [ ] `release/may-2025-v1` (V1)

## 📁 Script Files

| File | Purpose |
|------|---------|
| `scripts/deploy-composite.ps1` | Main deployment script (Windows) |
| `scripts/deploy-composite.sh` | Main deployment script (Linux/Mac) |
| `scripts/verify-deployment.ps1` | Post-deployment verification |
| `scripts/DEPLOYMENT_GUIDE.md` | Detailed documentation |
| `scripts/QUICK_DEPLOY.md` | Quick reference card |

## 🔧 How It Works

The deployment script performs these steps automatically:

1. **Build V1 with basePath '/v1'**
   - Checks out `release/may-2025-v1`
   - Temporarily modifies `next.config.mjs` to add basePath
   - Builds the project
   - Saves output to temp directory
   - Restores original config

2. **Build V2 at Root**
   - Checks out `feat/factory-floor`
   - Builds the web app
   - Saves output to temp directory

3. **Merge Builds**
   - Creates deployment artifact
   - Places V2 at root
   - Places V1 in `/v1` subdirectory
   - Adds `.nojekyll` for GitHub Pages

4. **Deploy to gh-pages**
   - Uses git worktree for safe deployment
   - Commits and pushes to `gh-pages` branch

5. **Cleanup**
   - Returns to original branch
   - Removes temporary files

## ⏱️ Expected Duration

- **Script Execution**: 5-10 minutes
  - V1 Build: 2-3 minutes
  - V2 Build: 2-3 minutes
  - Deploy: 1-2 minutes
- **GitHub Pages Rebuild**: 2-3 minutes

**Total**: ~10-15 minutes from start to live

## ✅ Success Criteria

After deployment completes successfully:

1. `gh-pages` branch contains:
   - Root `index.html` (V2)
   - `v1/index.html` (V1)
   - `.nojekyll` file

2. Both URLs are accessible:
   - `https://abishek-maharajan.online` loads V2
   - `https://abishek-maharajan.online/v1` loads V1

3. No 404 errors in browser console

4. All navigation and assets work correctly

## 🐛 Troubleshooting

### "Working directory is not clean"

```powershell
git stash
.\scripts\deploy-composite.ps1
git stash pop
```

### Script Permission Denied (Mac/Linux)

```bash
chmod +x scripts/deploy-composite.sh
```

### Build Fails

Check the error message and try building manually:

```bash
# Test V1 build
git checkout release/may-2025-v1
pnpm install
pnpm build

# Test V2 build
git checkout feat/factory-floor
pnpm install
pnpm --filter web build
```

### GitHub Pages Not Updating

1. Wait 5-10 minutes
2. Check Settings > Pages in GitHub
3. Verify source is `gh-pages` branch
4. Hard refresh browser (Ctrl+Shift+R)

### V1 Links Broken

The basePath modification may have failed. Check `release/may-2025-v1` branch and manually verify `next.config.mjs` has:

```javascript
basePath: "/v1",
assetPrefix: "/v1",
```

## 📚 Documentation

- **Quick Reference**: `scripts/QUICK_DEPLOY.md`
- **Detailed Guide**: `scripts/DEPLOYMENT_GUIDE.md`
- **This File**: `DEPLOYMENT_README.md`

## 🔄 Rollback

To rollback to a previous deployment:

```bash
git checkout gh-pages
git log  # Find commit hash
git reset --hard <commit-hash>
git push origin gh-pages --force
```

## 🎉 Next Steps

After successful deployment:

1. ✅ Verify both URLs work
2. ✅ Test navigation on both versions
3. ✅ Check browser console for errors
4. ✅ Test on mobile devices
5. ✅ Update DNS if needed
6. ✅ Share the new URLs!

## 📞 Support

If you encounter issues:

1. Check script output for error messages
2. Review `scripts/DEPLOYMENT_GUIDE.md`
3. Verify GitHub Pages settings
4. Check GitHub Actions logs
5. Try manual deployment steps

---

**Ready to deploy?** Run `.\scripts\deploy-composite.ps1` and watch the magic happen! ✨
