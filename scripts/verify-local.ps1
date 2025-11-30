# Local Verification Script
# Run this before deploying to production

$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🔍 PRE-DEPLOYMENT VERIFICATION" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Check if dev server is running
Write-Host "1. Checking dev server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✓ Dev server is running" -ForegroundColor Green
    }
} catch {
    Write-Host "   ✗ Dev server not running. Start with: pnpm --filter web dev" -ForegroundColor Red
    exit 1
}

# 2. Test docs pages
Write-Host "`n2. Testing docs pages..." -ForegroundColor Yellow
$docsPages = @(
    "/docs",
    "/docs/getting-started",
    "/docs/architecture",
    "/docs/components",
    "/docs/deployment",
    "/docs/agent-log"
)

foreach ($page in $docsPages) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000$page" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✓ $page" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ✗ $page failed" -ForegroundColor Red
        exit 1
    }
}

# 3. Test other pages
Write-Host "`n3. Testing other pages..." -ForegroundColor Yellow
$otherPages = @("/analytics", "/resume")

foreach ($page in $otherPages) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000$page" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✓ $page" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ✗ $page failed" -ForegroundColor Red
        exit 1
    }
}

# 4. Run tests
Write-Host "`n4. Running test suite..." -ForegroundColor Yellow
try {
    $testOutput = pnpm --filter web test:run 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ All tests passing" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Tests failed" -ForegroundColor Red
        Write-Host $testOutput
        exit 1
    }
} catch {
    Write-Host "   ✗ Test execution failed" -ForegroundColor Red
    exit 1
}

# 5. Check for TypeScript errors
Write-Host "`n5. Checking TypeScript..." -ForegroundColor Yellow
try {
    $tscOutput = pnpm --filter web typecheck 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ No TypeScript errors" -ForegroundColor Green
    } else {
        Write-Host "   ✗ TypeScript errors found" -ForegroundColor Red
        Write-Host $tscOutput
        exit 1
    }
} catch {
    Write-Host "   ✗ TypeScript check failed" -ForegroundColor Red
    exit 1
}

# 6. Test production build
Write-Host "`n6. Testing production build..." -ForegroundColor Yellow
try {
    $buildOutput = pnpm --filter web build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Production build successful" -ForegroundColor Green
        
        # Check if out directory exists
        if (Test-Path "apps/web/out") {
            $fileCount = (Get-ChildItem -Path "apps/web/out" -Recurse -File).Count
            Write-Host "   ✓ Generated $fileCount files" -ForegroundColor Green
        }
    } else {
        Write-Host "   ✗ Build failed" -ForegroundColor Red
        Write-Host $buildOutput
        exit 1
    }
} catch {
    Write-Host "   ✗ Build execution failed" -ForegroundColor Red
    exit 1
}

# 7. Check git status
Write-Host "`n7. Checking git status..." -ForegroundColor Yellow
$gitStatus = git status --short
if ($gitStatus) {
    Write-Host "   ⚠ Uncommitted changes detected:" -ForegroundColor Yellow
    Write-Host $gitStatus -ForegroundColor Gray
    Write-Host "   Consider committing before deployment" -ForegroundColor Yellow
} else {
    Write-Host "   ✓ Working directory clean" -ForegroundColor Green
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ PRE-DEPLOYMENT VERIFICATION PASSED" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Ready to deploy! Run:" -ForegroundColor Yellow
Write-Host "  .\scripts\deploy-composite.ps1`n" -ForegroundColor Cyan

Write-Host "Or verify manually in browser first:" -ForegroundColor Yellow
Write-Host "  1. Check http://localhost:3000/docs" -ForegroundColor White
Write-Host "  2. Verify sidebar is visible" -ForegroundColor White
Write-Host "  3. Check browser console for errors" -ForegroundColor White
Write-Host "  4. Test navigation between pages`n" -ForegroundColor White
