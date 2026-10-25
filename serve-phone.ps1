$port = 8080
$root = $PSScriptRoot
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
$listener.Start()
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback' -and $_.IPAddress -notmatch '^169\.' }).IPAddress
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  SerboLingo Phone Test Server" -ForegroundColor Cyan  
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  PC:    http://localhost:$port" -ForegroundColor Green
Write-Host "  PHONE: http://${ip}:$port" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Open the YELLOW link on your phone!" -ForegroundColor Yellow
Write-Host "  Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

# Automatically open default browser on PC
try {
    Start-Process "http://localhost:$port"
} catch {
    Write-Host "Please open http://localhost:$port in your browser." -ForegroundColor DarkGray
}

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.svg'  = 'image/svg+xml'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.mp3'  = 'audio/mpeg'
    '.wav'  = 'audio/wav'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
    '.ico'  = 'image/x-icon'
}

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $requestLine = $reader.ReadLine()
        
        # Read and discard headers
        while ($true) {
            $line = $reader.ReadLine()
            if ([string]::IsNullOrEmpty($line)) { break }
        }
        
        if ($requestLine -match '^GET\s+(\S+)') {
            $path = $Matches[1]
            if ($path -eq '/') { $path = '/index.html' }
            $path = [System.Uri]::UnescapeDataString($path)
            $fullPath = Join-Path $root $path.TrimStart('/')
            
            if (Test-Path $fullPath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
                $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
                $content = [System.IO.File]::ReadAllBytes($fullPath)
                $header = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($content.Length)`r`nCache-Control: no-store`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                $stream.Write($headerBytes, 0, $headerBytes.Length)
                $stream.Write($content, 0, $content.Length)
                Write-Host "200: $path" -ForegroundColor Green
            } else {
                $body = "<h1>404 Not Found</h1>"
                $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/html`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($header + $body)
                $stream.Write($bytes, 0, $bytes.Length)
                Write-Host "404: $path" -ForegroundColor Red
            }
        }
        
        $stream.Close()
        $client.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "Server stopped." -ForegroundColor Red
}
