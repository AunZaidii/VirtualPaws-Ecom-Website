@echo off
REM Quick Start Script for Track Order Testing (Windows)

echo.
echo ==========================================
echo Virtual Paws - Track Order Local Testing
echo ==========================================
echo.

REM Check if netlify-cli is installed
where netlify >nul 2>nul
if errorlevel 1 (
    echo 📦 Installing Netlify CLI...
    npm install -g netlify-cli
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

echo.
echo ✅ Setup Complete!
echo.
echo 🚀 Starting Netlify Dev Server...
echo.
echo    Frontend: http://localhost:8888
echo    Functions: http://localhost:9999/.netlify/functions
echo.
echo 📋 Test Steps:
echo    1. Go to: http://localhost:8888/cart-and-checkout/cart.html
echo    2. Complete checkout to create an order
echo    3. Note the order number (e.g., ABC123)
echo    4. Go to: http://localhost:8888/track-order/track-order.html
echo    5. Enter order number and email
echo    6. Click 'Track Order'
echo.
echo 💡 Tips:
echo    - Open DevTools (F12) to see console logs
echo    - Check Network tab to see API calls
echo    - Function logs appear in this terminal
echo.

call netlify dev
