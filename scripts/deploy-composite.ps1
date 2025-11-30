# Multi-Version GitHub Pages Deployment Script
# PowerShell version for Windows

$ErrorActionPreference = "Stop"

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Blue "========================================"
Write-ColorOutput Blue "Multi-Version GitHub Pages Deployment"
Write-ColorOutput Blue "========================================"
Write-Output ""

# Configuration
$V1_BRANCH = "release/may-2025-v1"
$V2_BRANCH = "feat/factory-floor"
$DEPLOY_BRANCH = "gh-pages"
$TIMESTAMP = [int][double]::Parse((Get-Date -UFormat %s))
$TEMP_DIR = Join-Path $env:TEMP "temp_deployment_$TIMESTAMP"
$V1_BUILD_DIR = Join-Path $TEMP_DIR "v1_build"
$V2_BUILD_DIR = Join-Path $TEMP_DIR "v2_build"
$DEPLOY_DIR = Join-Path $TEMP_DIR "deploy_artifact"

# Save current branch
$CURRENT_BRANCH = git branch --show-current
Write-ColorOutput Yellow "Current branch: $CURRENT_BRANCH"

# Check if working directory is clean
$gitStatus = git status -s
if ($gitStatus) {
    Write-ColorOutput Red "Error: Working directory is not clean. Please commit or stash changes."
    exit 1
}

# Create temporary directories
Write-ColorOutput Blue "Creating temporary directories..."
New-Item -ItemType Directory -Force -Path $V1_BUILD_DIR | Out-Null
New-Item -ItemType Directory -Force -Path $V2_BUILD_DIR | Out-Null
New-Item -ItemType Directory -Force -Path $DEPLOY_DIR | Out-Null

# ============================================
# STEP 1: Build V1 (Legacy) with basePath '/v1'
# ============================================
Write-Output ""
Write-ColorOutput Green "========================================"
Write-ColorOutput Green "STEP 1: Building V1 (Legacy)"
Write-ColorOutput Green "========================================"

Write-ColorOutput Yellow "Checking out $V1_BRANCH..."
git checkout $V1_BRANCH

# Check if V1 has the old structure (src/) or new structure (apps/web)
if (Test-Path "apps/web/next.config.mjs") {
    $V1_CONFIG_PATH = "apps/web/next.config.mjs"
    $V1_OUT_PATH = "apps/web/out"
    $V1_BUILD_CMD = "pnpm --filter web build"
} else {
    $V1_CONFIG_PATH = "next.config.mjs"
    $V1_OUT_PATH = "out"
    $V1_BUILD_CMD = "pnpm build"
}

Write-ColorOutput Yellow "Detected V1 config at: $V1_CONFIG_PATH"

# Verify config file exists
if (-not (Test-Path $V1_CONFIG_PATH)) {
    Write-ColorOutput Red "Error: Config file not found at $V1_CONFIG_PATH"
    Write-ColorOutput Red "V1 branch structure may have changed."
    git checkout $CURRENT_BRANCH
    Remove-Item -Path $TEMP_DIR -Recurse -Force -ErrorAction SilentlyContinue
    exit 1
}

# Backup original config
Copy-Item $V1_CONFIG_PATH "$V1_CONFIG_PATH.backup"

# Modify next.config to add basePath '/v1'
Write-ColorOutput Yellow "Modifying Next.js config to add basePath: '/v1'..."

$configContent = Get-Content $V1_CONFIG_PATH -Raw
$configContent = $configContent -replace 'output: "export",', 'output: "export",`n  basePath: "/v1",`n  assetPrefix: "/v1",'
Set-Content $V1_CONFIG_PATH $configContent

Write-ColorOutput Yellow "Installing V1 dependencies..."
pnpm install

Write-ColorOutput Yellow "Building V1..."
Invoke-Expression $V1_BUILD_CMD

# Copy V1 build output to temp directory
Write-ColorOutput Yellow "Copying V1 build to temporary location..."
Copy-Item -Path "$V1_OUT_PATH\*" -Destination $V1_BUILD_DIR -Recurse -Force

# Restore original config
Write-ColorOutput Yellow "Restoring original config..."
Move-Item "$V1_CONFIG_PATH.backup" $V1_CONFIG_PATH -Force

Write-ColorOutput Green "✓ V1 build complete!"

# ============================================
# STEP 2: Build V2 (Factory Floor)
# ============================================
Write-Output ""
Write-ColorOutput Green "========================================"
Write-ColorOutput Green "STEP 2: Building V2 (Factory Floor)"
Write-ColorOutput Green "========================================"

Write-ColorOutput Yellow "Checking out $V2_BRANCH..."
git checkout $V2_BRANCH

Write-ColorOutput Yellow "Installing V2 dependencies..."
pnpm install

Write-ColorOutput Yellow "Building V2..."
pnpm --filter web build

# Copy V2 build output to temp directory
Write-ColorOutput Yellow "Copying V2 build to temporary location..."
Copy-Item -Path "apps\web\out\*" -Destination $V2_BUILD_DIR -Recurse -Force

Write-ColorOutput Green "✓ V2 build complete!"

# ============================================
# STEP 3: Merge Builds
# ============================================
Write-Output ""
Write-ColorOutput Green "========================================"
Write-ColorOutput Green "STEP 3: Merging Builds"
Write-ColorOutput Green "========================================"

Write-ColorOutput Yellow "Copying V2 (root) to deployment directory..."
Copy-Item -Path "$V2_BUILD_DIR\*" -Destination $DEPLOY_DIR -Recurse -Force

Write-ColorOutput Yellow "Copying V1 to /v1 subdirectory..."
$V1_DEPLOY_DIR = Join-Path $DEPLOY_DIR "v1"
New-Item -ItemType Directory -Force -Path $V1_DEPLOY_DIR | Out-Null
Copy-Item -Path "$V1_BUILD_DIR\*" -Destination $V1_DEPLOY_DIR -Recurse -Force

# Create a .nojekyll file to prevent GitHub Pages from ignoring files starting with _
New-Item -ItemType File -Path (Join-Path $DEPLOY_DIR ".nojekyll") -Force | Out-Null

Write-ColorOutput Green "✓ Builds merged successfully!"

# ============================================
# STEP 4: Deploy to gh-pages
# ============================================
Write-Output ""
Write-ColorOutput Green "========================================"
Write-ColorOutput Green "STEP 4: Deploying to gh-pages"
Write-ColorOutput Green "========================================"

# Check if gh-pages branch exists
$branchExists = git show-ref --verify --quiet "refs/heads/$DEPLOY_BRANCH"
if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput Yellow "gh-pages branch exists"
} else {
    Write-ColorOutput Yellow "Creating gh-pages branch..."
    git checkout --orphan $DEPLOY_BRANCH
    git rm -rf .
    git commit --allow-empty -m "Initialize gh-pages branch"
    git checkout $V2_BRANCH
}

# Use git worktree for safer deployment
$WORKTREE_DIR = Join-Path $TEMP_DIR "gh-pages-worktree"
Write-ColorOutput Yellow "Creating git worktree for gh-pages..."

# Remove worktree if it exists
git worktree remove $WORKTREE_DIR 2>$null

git worktree add $WORKTREE_DIR $DEPLOY_BRANCH

# Clear existing content in gh-pages
Write-ColorOutput Yellow "Clearing existing gh-pages content..."
Get-ChildItem -Path $WORKTREE_DIR -Exclude ".git" | Remove-Item -Recurse -Force

# Copy deployment artifact to gh-pages worktree
Write-ColorOutput Yellow "Copying deployment artifact to gh-pages..."
Copy-Item -Path "$DEPLOY_DIR\*" -Destination $WORKTREE_DIR -Recurse -Force

# Commit and push
Push-Location $WORKTREE_DIR
git add -A

$hasChanges = git diff --staged --quiet
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Yellow "Committing changes..."
    $commitDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Deploy: V2 at root, V1 at /v1 ($commitDate)"
    
    Write-ColorOutput Yellow "Pushing to gh-pages..."
    git push origin $DEPLOY_BRANCH
    
    Write-ColorOutput Green "✓ Deployment successful!"
} else {
    Write-ColorOutput Yellow "No changes to deploy"
}

Pop-Location

# Clean up worktree
Write-ColorOutput Yellow "Cleaning up worktree..."
git worktree remove $WORKTREE_DIR

# ============================================
# STEP 5: Cleanup
# ============================================
Write-Output ""
Write-ColorOutput Green "========================================"
Write-ColorOutput Green "STEP 5: Cleanup"
Write-ColorOutput Green "========================================"

Write-ColorOutput Yellow "Returning to original branch: $CURRENT_BRANCH"
git checkout $CURRENT_BRANCH

Write-ColorOutput Yellow "Removing temporary directories..."
Remove-Item -Path $TEMP_DIR -Recurse -Force

# ============================================
# Success Summary
# ============================================
Write-Output ""
Write-ColorOutput Green "========================================"
Write-ColorOutput Green "✓ DEPLOYMENT COMPLETE!"
Write-ColorOutput Green "========================================"
Write-Output ""
Write-ColorOutput Blue "Verification URLs:"
Write-Output "  V2 (Root):  https://abishek-maharajan.online"
Write-Output "  V1 (Sub):   https://abishek-maharajan.online/v1"
Write-Output ""
Write-ColorOutput Blue "Next Steps:"
Write-Output "  1. Wait 2-3 minutes for GitHub Pages to rebuild"
Write-Output "  2. Visit the URLs above to verify deployment"
Write-Output "  3. Check browser console for any 404 errors"
Write-Output ""
