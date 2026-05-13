# 简单的 PowerShell HTTP 服务器
$port = 3000
$baseDir = "d:\CTYUN"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                      ║" -ForegroundColor Cyan
Write-Host "║   天翼云报价工具 - 本地服务器                        ║" -ForegroundColor Cyan
Write-Host "║                                                      ║" -ForegroundColor Cyan
Write-Host "║   报价工具: http://localhost:$port/index.html         ║" -ForegroundColor Cyan
Write-Host "║   后台管理: http://localhost:$port/admin.html         ║" -ForegroundColor Cyan
Write-Host "║                                                      ║" -ForegroundColor Cyan
Write-Host "║   按 Ctrl+C 停止服务器                              ║" -ForegroundColor Cyan
Write-Host "║                                                      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

try {
    $listener.Start()
    Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] 服务器已启动" -ForegroundColor Green
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # 默认页面
        $urlPath = $request.Url.AbsolutePath
        if ($urlPath -eq "/") {
            $urlPath = "/index.html"
        }
        
        $filePath = Join-Path $baseDir $urlPath.Replace("/", "\")
        
        Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] $($request.HttpMethod) $($request.Url.AbsolutePath)" -ForegroundColor Yellow
        
        if (Test-Path $filePath) {
            $content = Get-Content $filePath -Raw -Encoding UTF8
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mimeTypes = @{
                ".html" = "text/html; charset=utf-8"
                ".js" = "application/javascript; charset=utf-8"
                ".css" = "text/css; charset=utf-8"
                ".json" = "application/json"
                ".png" = "image/png"
                ".jpg" = "image/jpeg"
                ".gif" = "image/gif"
                ".svg" = "image/svg+xml"
                ".ico" = "image/x-icon"
            }
            
            $contentType = $mimeTypes[$ext]
            if (-not $contentType) {
                $contentType = "application/octet-stream"
            }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $errorHtml = "<html><body><h1>404 - Not Found</h1><p>文件不存在: $urlPath</p></body></html>"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($errorHtml)
            $response.ContentType = "text/html; charset=utf-8"
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        
        $response.Close()
    }
} catch {
    Write-Host "错误: $_" -ForegroundColor Red
} finally {
    $listener.Stop()
    $listener.Close()
}
