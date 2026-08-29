$json = [System.IO.File]::ReadAllText("$PWD\seed-data.json", [System.Text.Encoding]::UTF8)
$js = "window.SEED_DATA = " + $json + ";"
[System.IO.File]::WriteAllText("$PWD\seed-data.js", $js, [System.Text.Encoding]::UTF8)
