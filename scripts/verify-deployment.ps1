# Deployment Verification Script
# Checks if both V1 and V2 are accessible

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Blue
Write-Host "Deployment Verification" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

$V2_URL = "https://abishek-maharajan.online"
$V1_URL = "https://abishek-maharajan.online/v1"

function Test-Url {
    param($url, $name)
    
    Write-Host "Testing $name..." -ForegroundColor Yellow
    Write-Host "  URL: $url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ Status: $($response.StatusCode) OK" -ForegroundColor Green
            return $true
        } else {
            Write-Host "  ✗ Status: $($response.StatusCode)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test V2 (Root)
Write-Host ""
$v2Success = Test-Url -url $V2_URL -name "V2 (Root)"

# Test V1 (Subdirectory)
Write-Host ""
$v1Success = Test-Url -url $V1_URL -name "V1 (Subdirectory)"

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Blue
Write-Host "Summary" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

if ($v2Success -and $v1Success) {
    Write-Host "✓ Both versions are accessible!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Visit these URLs in your browser:" -ForegroundColor Cyan
    Write-Host "  V2: $V2_URL" -ForegroundColor White
    Write-Host "  V1: $V1_URL" -ForegroundColor White
} elseif ($v2Success) {
    Write-Host "⚠ V2 is accessible, but V1 is not" -ForegroundColor Yellow
    Write-Host "  This might be normal if deployment just completed." -ForegroundColor Gray
    Write-Host "  Wait 2-3 minutes and run this script again." -ForegroundColor Gray
} elseif ($v1Success) {
    Write-Host "⚠ V1 is accessible, but V2 is not" -ForegroundColor Yellow
    Write-Host "  This is unusual. Check the gh-pages branch." -ForegroundColor Gray
} else {
    Write-Host "✗ Neither version is accessible" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible causes:" -ForegroundColor Yellow
    Write-Host "  1. GitHub Pages is still building (wait 2-3 minutes)" -ForegroundColor Gray
    Write-Host "  2. DNS not configured correctly" -ForegroundColor Gray
    Write-Host "  3. Repository Pages settings incorrect" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Check: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/pages" -ForegroundColor Cyan
}

Write-Host ""
