@echo off
echo ========================================
echo     WMS System - Production Build
echo ========================================
echo.

echo 1. Installing dependencies...
call npm install

echo.
echo 2. Building Tailwind CSS...
call npm run build:css:prod

echo.
echo 3. Creating production HTML...
copy index.html index-production.html

echo.
echo 4. Updating production HTML to use compiled CSS...
powershell -Command "(Get-Content index-production.html) -replace '<script src=\"https://cdn.tailwindcss.com\"></script>', '<!-- Tailwind CSS Production Build -->' -replace '<link rel=\"stylesheet\" href=\"css/main.css\">', '<link rel=\"stylesheet\" href=\"css/output.css\">' | Set-Content index-production.html"

echo.
echo ========================================
echo     Production build complete!
echo ========================================
echo.
echo Files created:
echo - css/output.css (Compiled Tailwind CSS)
echo - index-production.html (Production HTML)
echo.
echo To deploy, use index-production.html instead of index.html
echo.
pause
