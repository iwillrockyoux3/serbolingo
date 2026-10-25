$port = 8080
$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

# Check if port is already in use
$existing = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host ""
    Write-Host "  Port $port is already in use!" -ForegroundColor Red
    Write-Host "  Close the other server first, or open http://localhost:$port in your browser." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

# Try adding LAN IP for phone access (requires no admin on some systems)
try {
    $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback' -and $_.IPAddress -notmatch '^169\.' } | Select-Object -First 1).IPAddress
    if ($ip) {
        $listener.Prefixes.Add("http://${ip}:$port/")
    }
} catch { $ip = $null }

try {
    $listener.Start()
} catch {
    # If LAN IP binding fails (needs admin), remove it and retry with localhost only
    $listener.Close()
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Prefixes.Add("http://127.0.0.1:$port/")
    $listener.Start()
    $ip = $null
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  SerboLingo PWA & Offline Server" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  PC:    http://localhost:$port" -ForegroundColor Green
if ($ip) {
    Write-Host "  PHONE: http://${ip}:$port" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Open the YELLOW link on your phone!" -ForegroundColor Yellow
} else {
    Write-Host "  (Phone access requires running as Administrator)" -ForegroundColor DarkGray
}
Write-Host "  Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

# Auto-open browser
try { Start-Process "http://localhost:$port" } catch {}

$mimeTypes = @{
    '.html'  = 'text/html; charset=utf-8'
    '.js'    = 'application/javascript; charset=utf-8'
    '.css'   = 'text/css; charset=utf-8'
    '.json'  = 'application/json; charset=utf-8'
    '.svg'   = 'image/svg+xml'
    '.png'   = 'image/png'
    '.jpg'   = 'image/jpeg'
    '.jpeg'  = 'image/jpeg'
    '.mp3'   = 'audio/mpeg'
    '.wav'   = 'audio/wav'
    '.woff'  = 'font/woff'
    '.woff2' = 'font/woff2'
    '.ico'   = 'image/x-icon'
    '.webp'  = 'image/webp'
    '.webmanifest' = 'application/manifest+json; charset=utf-8'
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        # Extract clean path (HttpListener already parses the URL properly)
        $path = $req.Url.LocalPath
        if ($path -eq '/' -or $path -eq '') { $path = '/index.html' }
        $path = [System.Uri]::UnescapeDataString($path)
        $fullPath = Join-Path $root $path.TrimStart('/')

        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
            $res.ContentType = $mime
            $res.Headers.Add('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            $res.Headers.Add('Access-Control-Allow-Origin', '*')
            $res.Headers.Add('Service-Worker-Allowed', '/')
            $content = [System.IO.File]::ReadAllBytes($fullPath)
            $res.ContentLength64 = $content.Length
            $res.StatusCode = 200
            $res.OutputStream.Write($content, 0, $content.Length)
            Write-Host "200: $($req.Url.PathAndQuery)" -ForegroundColor Green
        } else {
            $res.StatusCode = 404
            $body = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1>")
            $res.ContentType = 'text/html; charset=utf-8'
            $res.ContentLength64 = $body.Length
            $res.OutputStream.Write($body, 0, $body.Length)
            Write-Host "404: $($req.Url.PathAndQuery)" -ForegroundColor Red
        }

        $res.Close()
    }
} catch {
    if ($_.Exception.Message -notmatch 'thread abort|stopped') {
        Write-Host "Server error: $_" -ForegroundColor Red
    }
} finally {
    $listener.Stop()
    $listener.Close()
    Write-Host "Server stopped." -ForegroundColor DarkGray
}
