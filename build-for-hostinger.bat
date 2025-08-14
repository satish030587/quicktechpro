@echo off
echo ========================================
echo  QuickTechPro Website Builder
echo ========================================
echo.

echo [1/3] Checking Node.js...
node --version > nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo [2/3] Building website for Hostinger...
echo This may take 30-60 seconds...
echo.

npm run deploy

if errorlevel 1 (
    echo.
    echo ❌ Build failed! Check the error messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Website built successfully!
echo ========================================
echo.
echo Your website files are ready in the 'out' folder.
echo.
echo 📁 Files location: %CD%\out\
echo.
echo 🚀 Next steps:
echo 1. Login to your Hostinger hPanel
echo 2. Open File Manager
echo 3. Go to public_html folder
echo 4. Delete existing files
echo 5. Upload ALL files from the 'out' folder
echo.
echo 🌐 Your website will be live at: https://quicktechpro.in
echo.
echo Press any key to open the 'out' folder...
pause > nul

start explorer "%CD%\out"

echo.
echo 📋 Quick Upload Checklist:
echo [ ] Login to Hostinger hPanel
echo [ ] Open File Manager → public_html
echo [ ] Delete old files
echo [ ] Upload all files from 'out' folder
echo [ ] Test website at https://quicktechpro.in
echo.
pause
