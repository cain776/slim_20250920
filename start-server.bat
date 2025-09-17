@echo off
echo Starting local web server on http://localhost:8000
echo Please open your web browser and navigate to http://localhost:8000
echo.
echo To stop the server, close this window.
python -m http.server 8000
pause
