#!/bin/bash
# Quick Start Script for Track Order Testing

echo "=========================================="
echo "Virtual Paws - Track Order Local Testing"
echo "=========================================="
echo ""

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🚀 Starting Netlify Dev Server..."
echo ""
echo "   Frontend: http://localhost:8888"
echo "   Functions: http://localhost:9999/.netlify/functions"
echo ""
echo "📋 Test Steps:"
echo "   1. Go to: http://localhost:8888/cart-and-checkout/cart.html"
echo "   2. Complete checkout to create an order"
echo "   3. Note the order number (e.g., ABC123)"
echo "   4. Go to: http://localhost:8888/track-order/track-order.html"
echo "   5. Enter order number and email"
echo "   6. Click 'Track Order'"
echo ""
echo "💡 Tips:"
echo "   - Open DevTools (F12) to see console logs"
echo "   - Check Network tab to see API calls"
echo "   - Function logs appear in terminal"
echo ""

netlify dev
