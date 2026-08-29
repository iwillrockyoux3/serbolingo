$json = Get-Content 'seed-data.json' -Raw
$js = "window.SEED_DATA = " + $json + ";"
Set-Content -Path 'seed-data.js' -Value $js -Encoding UTF8
