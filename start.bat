@echo off
echo =========================================
echo   Starting SerboLingo Local Server...
echo =========================================
echo.
echo Chrome blocks microphone access on file:/// links.
echo This local server bypasses that restriction!
echo.
echo Your browser will open automatically...
echo Keep this window open while using the app.
echo Press Ctrl+C to close the server.
echo.

start http://localhost:8080

powershell -NoProfile -ExecutionPolicy Bypass -Command "$listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8080/'); $listener.Start(); Write-Host 'Listening on http://localhost:8080...'; while ($listener.IsListening) { $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $path = $request.Url.LocalPath; if ($path -eq '/') { $path = '/index.html' }; $fullPath = Join-Path (Get-Location).Path $path.TrimStart('/'); if (Test-Path $fullPath -PathType Leaf) { $ext = [System.IO.Path]::GetExtension($fullPath); $mime = switch ($ext) { '.html' {'text/html'} '.js' {'application/javascript'} '.css' {'text/css'} '.json' {'application/json'} '.svg' {'image/svg+xml'} default {'application/octet-stream'} }; $response.ContentType = $mime; $content = [System.IO.File]::ReadAllBytes($fullPath); $response.ContentLength64 = $content.Length; $response.OutputStream.Write($content, 0, $content.Length); $response.StatusCode = 200 } else { $response.StatusCode = 404 }; $response.Close() }"
