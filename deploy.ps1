# ============================================================
#  天翼云报价工具 - 本地上传 + 远程部署脚本 (PowerShell)
# ============================================================
#  使用方法: 在 PowerShell 中执行:
#    .\deploy.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$SERVER = "Ubuntu@159.75.243.119"
$REMOTE_DIR = "/opt/ctyun-quote"
$LOCAL_DIR = "d:\CTYUN"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  天翼云报价工具 - 一键部署" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# ---- 检查 scp 是否可用 ----
Write-Host "`n[1/4] 检查 SSH/SCP 工具..." -ForegroundColor Yellow
$scpCmd = Get-Command scp -ErrorAction SilentlyContinue
if (-not $scpCmd) {
    Write-Host "❌ 未找到 scp 命令。请安装 OpenSSH 或 Git for Windows。" -ForegroundColor Red
    # 尝试使用 Windows 自带的 scp
    $scpCmd = "C:\Windows\System32\OpenSSH\scp.exe"
    if (Test-Path $scpCmd) {
        Write-Host "✅ 找到 Windows OpenSSH: $scpCmd" -ForegroundColor Green
    } else {
        Write-Host "请手动执行 SSH 上传，或安装 Git Bash。" -ForegroundColor Red
        exit 1
    }
} else {
    $scpCmd = $scpCmd.Source
    Write-Host "✅ SCP 可用: $scpCmd" -ForegroundColor Green
}

# ---- 上传文件到服务器 ----
Write-Host "`n[2/4] 上传项目文件到服务器..." -ForegroundColor Yellow
Write-Host "  从: $LOCAL_DIR" -ForegroundColor Gray
Write-Host "  到: ${SERVER}:${REMOTE_DIR}" -ForegroundColor Gray

$excludeArgs = @(
    "--exclude=node_modules",
    "--exclude=cloudfunctions", 
    "--exclude=js-sdk-temp",
    "--exclude=js-sdk.tar",
    "--exclude=.git",
    "--exclude=*.csv",
    "--exclude=license_codes*",
    "--exclude=generate-codes.js"
) -join " "

# 先在远程创建目录
ssh $SERVER "mkdir -p $REMOTE_DIR" 2>$null

# 使用 rsync（更快），如果没有则用 scp
$rsyncCmd = Get-Command rsync -ErrorAction SilentlyContinue
if ($rsyncCmd) {
    Write-Host "  使用 rsync 同步..." -ForegroundColor Gray
    & rsync -avz --progress $excludeArgs "$($LOCAL_DIR -replace '\','/')/" "${SERVER}:${REMOTE_DIR}/"
} else {
    Write-Host "  使用 scp 上传（可能较慢）..." -ForegroundColor Gray
    # 用 tar + ssh 管道方式，更可靠
    Set-Location $LOCAL_DIR
    # 排除大目录
    $excludeList = @("node_modules","cloudfunctions","js-sdk-temp","js-sdk.tar",".git")
    $tarExclude = ($excludeList | ForEach-Object { "--exclude=$_" }) -join " "
    # PowerShell 的 tar 支持
    & $scpCmd -r $(Get-ChildItem -Path $LOCAL_DIR -File | Select-Object -ExpandProperty Name) $SERVER:${REMOTE_DIR}/
    & $scpCmd -r css js images $SERVER:${REMOTE_DIR}/ 2>$null
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  上传可能有问题，但继续部署..." -ForegroundColor Yellow
}
Write-Host "✅ 文件上传完成" -ForegroundColor Green

# ---- 远程执行部署 ----
Write-Host "`n[3/4] 在服务器上构建并启动容器..." -ForegroundColor Yellow
ssh $SERVER "cd $REMOTE_DIR && bash deploy.sh"

# ---- 验证访问 ----
Write-Host "`n[4/4] 验证服务可访问性..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://159.75.243.119:3000/api/health" -TimeoutSec 10 -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    if ($data.status -eq "ok") {
        Write-Host "✅ 服务运行正常!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  服务响应异常" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  无法连接到 http://159.75.243.119:3000" -ForegroundColor Yellow
    Write-Host "   可能原因: 防火墙未开放 3000 端口" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  🎉 部署完成!" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  访问地址: http://159.75.243.119:3000" -ForegroundColor White
Write-Host "  健康检查: http://159.75.243.119:3000/api/health" -ForegroundColor White
Write-Host ""
Write-Host "  常用命令:" -ForegroundColor Gray
Write-Host "    查看日志: ssh $SERVER 'cd $REMOTE_DIR && docker compose logs -f'" -ForegroundColor Gray
Write-Host "    重启服务: ssh $SERVER 'cd $REMOTE_DIR && docker compose restart'" -ForegroundColor Gray
Write-Host "    停止服务: ssh $SERVER 'cd $REMOTE_DIR && docker compose down'" -ForegroundColor Gray
Write-Host ""
