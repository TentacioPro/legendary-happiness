#!/bin/bash
set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Multi-Version GitHub Pages Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Configuration
V1_BRANCH="release/may-2025-v1"
V2_BRANCH="feat/factory-floor"
DEPLOY_BRANCH="gh-pages"
TEMP_DIR="../temp_deployment_$(date +%s)"
V1_BUILD_DIR="$TEMP_DIR/v1_build"
V2_BUILD_DIR="$TEMP_DIR/v2_build"
DEPLOY_DIR="$TEMP_DIR/deploy_artifact"

# Save current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}Current branch: $CURRENT_BRANCH${NC}"

# Check if working directory is clean
if [[ -n $(git status -s) ]]; then
    echo -e "${RED}Error: Working directory is not clean. Please commit or stash changes.${NC}"
    exit 1
fi

# Create temporary directories
echo -e "${BLUE}Creating temporary directories...${NC}"
mkdir -p "$V1_BUILD_DIR"
mkdir -p "$V2_BUILD_DIR"
mkdir -p "$DEPLOY_DIR"

# ============================================
# STEP 1: Build V1 (Legacy) with basePath '/v1'
# ============================================
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}STEP 1: Building V1 (Legacy)${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "${YELLOW}Checking out $V1_BRANCH...${NC}"
git checkout "$V1_BRANCH"

# Check if V1 has the old structure (src/) or new structure (apps/web)
if [ -f "apps/web/next.config.mjs" ]; then
    V1_CONFIG_PATH="apps/web/next.config.mjs"
    V1_OUT_PATH="apps/web/out"
    V1_BUILD_CMD="pnpm --filter web build"
else
    V1_CONFIG_PATH="next.config.mjs"
    V1_OUT_PATH="out"
    V1_BUILD_CMD="pnpm build"
fi

echo -e "${YELLOW}Detected V1 config at: $V1_CONFIG_PATH${NC}"

# Verify config file exists
if [ ! -f "$V1_CONFIG_PATH" ]; then
    echo -e "${RED}Error: Config file not found at $V1_CONFIG_PATH${NC}"
    echo -e "${RED}V1 branch structure may have changed.${NC}"
    git checkout "$CURRENT_BRANCH"
    rm -rf "$TEMP_DIR"
    exit 1
fi

# Backup original config
cp "$V1_CONFIG_PATH" "$V1_CONFIG_PATH.backup"

# Modify next.config to add basePath '/v1'
echo -e "${YELLOW}Modifying Next.js config to add basePath: '/v1'...${NC}"

# Replace existing basePath and assetPrefix values
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' 's/basePath: "[^"]*"/basePath: "\/v1"/' "$V1_CONFIG_PATH"
    sed -i '' 's/assetPrefix: "[^"]*"/assetPrefix: "\/v1"/' "$V1_CONFIG_PATH"
else
    # Linux/Windows Git Bash
    sed -i 's/basePath: "[^"]*"/basePath: "\/v1"/' "$V1_CONFIG_PATH"
    sed -i 's/assetPrefix: "[^"]*"/assetPrefix: "\/v1"/' "$V1_CONFIG_PATH"
fi

echo -e "${YELLOW}Installing V1 dependencies...${NC}"
pnpm install

echo -e "${YELLOW}Building V1...${NC}"
$V1_BUILD_CMD

# Copy V1 build output to temp directory
echo -e "${YELLOW}Copying V1 build to temporary location...${NC}"
cp -r "$V1_OUT_PATH"/* "$V1_BUILD_DIR/"

# Restore original config
echo -e "${YELLOW}Restoring original config...${NC}"
mv "$V1_CONFIG_PATH.backup" "$V1_CONFIG_PATH"

echo -e "${GREEN}✓ V1 build complete!${NC}"

# ============================================
# STEP 2: Build V2 (Factory Floor)
# ============================================
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}STEP 2: Building V2 (Factory Floor)${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "${YELLOW}Checking out $V2_BRANCH...${NC}"
git checkout "$V2_BRANCH"

echo -e "${YELLOW}Installing V2 dependencies...${NC}"
pnpm install

echo -e "${YELLOW}Building V2...${NC}"
pnpm --filter web build

# Copy V2 build output to temp directory
echo -e "${YELLOW}Copying V2 build to temporary location...${NC}"
cp -r apps/web/out/* "$V2_BUILD_DIR/"

echo -e "${GREEN}✓ V2 build complete!${NC}"

# ============================================
# STEP 3: Merge Builds
# ============================================
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}STEP 3: Merging Builds${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "${YELLOW}Copying V2 (root) to deployment directory...${NC}"
cp -r "$V2_BUILD_DIR"/* "$DEPLOY_DIR/"

echo -e "${YELLOW}Copying V1 to /v1 subdirectory...${NC}"
mkdir -p "$DEPLOY_DIR/v1"
cp -r "$V1_BUILD_DIR"/* "$DEPLOY_DIR/v1/"

# Create a .nojekyll file to prevent GitHub Pages from ignoring files starting with _
touch "$DEPLOY_DIR/.nojekyll"

# Create CNAME file for custom domain
echo -e "${YELLOW}Creating CNAME file for custom domain...${NC}"
echo -n "abishek-maharajan.online" > "$DEPLOY_DIR/CNAME"

echo -e "${GREEN}✓ Builds merged successfully!${NC}"

# ============================================
# STEP 4: Deploy to gh-pages
# ============================================
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}STEP 4: Deploying to gh-pages${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if gh-pages branch exists
if git show-ref --verify --quiet "refs/heads/$DEPLOY_BRANCH"; then
    echo -e "${YELLOW}gh-pages branch exists${NC}"
else
    echo -e "${YELLOW}Creating gh-pages branch...${NC}"
    git checkout --orphan "$DEPLOY_BRANCH"
    git rm -rf .
    git commit --allow-empty -m "Initialize gh-pages branch"
    git checkout "$V2_BRANCH"
fi

# Use git worktree for safer deployment
WORKTREE_DIR="$TEMP_DIR/gh-pages-worktree"
echo -e "${YELLOW}Creating git worktree for gh-pages...${NC}"

# Remove worktree if it exists
git worktree remove "$WORKTREE_DIR" 2>/dev/null || true

git worktree add "$WORKTREE_DIR" "$DEPLOY_BRANCH"

# Clear existing content in gh-pages
echo -e "${YELLOW}Clearing existing gh-pages content...${NC}"
rm -rf "$WORKTREE_DIR"/*
rm -rf "$WORKTREE_DIR"/.??*  # Remove hidden files except .git

# Copy deployment artifact to gh-pages worktree
echo -e "${YELLOW}Copying deployment artifact to gh-pages...${NC}"
cp -r "$DEPLOY_DIR"/* "$WORKTREE_DIR/"
cp -r "$DEPLOY_DIR"/.nojekyll "$WORKTREE_DIR/"

# Commit and push
cd "$WORKTREE_DIR"
git add -A

if git diff --staged --quiet; then
    echo -e "${YELLOW}No changes to deploy${NC}"
else
    echo -e "${YELLOW}Committing changes...${NC}"
    git commit -m "Deploy: V2 at root, V1 at /v1 ($(date '+%Y-%m-%d %H:%M:%S'))"
    
    echo -e "${YELLOW}Pushing to gh-pages...${NC}"
    git push origin "$DEPLOY_BRANCH" --force
    
    echo -e "${GREEN}✓ Deployment successful!${NC}"
fi

# Return to original directory
cd -

# Clean up worktree
echo -e "${YELLOW}Cleaning up worktree...${NC}"
git worktree remove "$WORKTREE_DIR"

# ============================================
# STEP 5: Cleanup
# ============================================
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}STEP 5: Cleanup${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "${YELLOW}Returning to original branch: $CURRENT_BRANCH${NC}"
git checkout "$CURRENT_BRANCH"

echo -e "${YELLOW}Removing temporary directories...${NC}"
rm -rf "$TEMP_DIR"

# ============================================
# Success Summary
# ============================================
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Verification URLs:${NC}"
echo -e "  V2 (Root):  ${YELLOW}https://abishek-maharajan.online${NC}"
echo -e "  V1 (Sub):   ${YELLOW}https://abishek-maharajan.online/v1${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo -e "  1. Wait 2-3 minutes for GitHub Pages to rebuild"
echo -e "  2. Visit the URLs above to verify deployment"
echo -e "  3. Check browser console for any 404 errors"
echo ""
