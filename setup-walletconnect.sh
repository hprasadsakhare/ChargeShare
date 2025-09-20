#!/bin/bash

echo "🔧 ChargeShare WalletConnect Setup"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f "frontend/.env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > frontend/.env.local << EOF
# Flow Network Configuration
NEXT_PUBLIC_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
NEXT_PUBLIC_FLOW_WALLET_DISCOVERY=https://fcl-discovery.onflow.org/testnet/authn

# App Configuration
NEXT_PUBLIC_APP_TITLE=ChargeShare
NEXT_PUBLIC_APP_ICON=https://placehold.co/64x64
NEXT_PUBLIC_APP_URL=http://localhost:3000

# WalletConnect Configuration (Required for wallet compatibility)
# Get your project ID from: https://cloud.walletconnect.com
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id_here

# Deployed contract addresses (replace with yours)
NEXT_PUBLIC_STATION_REGISTRY=0xSTATION
NEXT_PUBLIC_BOOKING_ESCROW=0xESCROW
NEXT_PUBLIC_REPUTATION_NFT=0xREPUTATION

# Standards (testnet)
NEXT_PUBLIC_FT_ADDRESS=0x9a0766d93b6608b7
NEXT_PUBLIC_NFT_ADDRESS=0x631e88ae7f1d7c20
EOF
    echo "✅ Created frontend/.env.local"
else
    echo "⚠️  frontend/.env.local already exists"
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Get a WalletConnect Project ID from: https://cloud.walletconnect.com"
echo "2. Replace 'your_walletconnect_project_id_here' in frontend/.env.local with your actual project ID"
echo "3. Run: cd frontend && npm run dev"
echo ""
echo "📚 For detailed instructions, see: WALLETCONNECT_SETUP.md"
echo ""
echo "✨ Setup complete!"
