@echo off
title SerboLingo Local Server Launcher
cd /d "%~dp0"
echo ========================================================
echo        SerboLingo PWA & Offline Local Server
echo ========================================================
echo.
echo Starting local web server on port 8080...
echo Google Chrome / your browser will open automatically!
echo.
echo Keep this window open while using SerboLingo.
echo Press Ctrl+C to stop the server anytime.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve-phone.ps1"
