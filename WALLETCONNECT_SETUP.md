# WalletConnect Setup Guide

## Overview
This guide explains how to set up WalletConnect for the ChargeShare dApp to ensure compatibility with all supported wallets.

## Required Environment Variables

Create a `.env.local` file in the `frontend` directory with the following variables:

```bash
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
```

## Steps to Get WalletConnect Project ID

1. **Register at WalletConnect Cloud**: Visit [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. **Create a new project**: Click "Create Project" and fill in your dApp details
3. **Get your Project ID**: Copy the project ID from your project dashboard
4. **Add to environment**: Replace `your_walletconnect_project_id_here` with your actual project ID

## Important Notes

- **Required for wallet compatibility**: Without a valid WalletConnect project ID, users will be unable to use certain wallets to interact with your dApp
- **Free tier available**: WalletConnect offers a free tier with sufficient limits for most dApps
- **Security**: Never commit your actual project ID to version control - use environment variables

## Network Configuration

For production deployment, update the following variables:

```bash
# For mainnet
NEXT_PUBLIC_FLOW_ACCESS_NODE=https://rest-mainnet.onflow.org
NEXT_PUBLIC_FLOW_WALLET_DISCOVERY=https://fcl-discovery.onflow.org/mainnet/authn
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Troubleshooting

If you encounter wallet connection issues:

1. Verify your WalletConnect project ID is correct
2. Check that your dApp URL matches the one registered in WalletConnect
3. Ensure all environment variables are properly set
4. Check the browser console for any error messages

For more information, visit the [Flow Developer Portal](https://developers.flow.com/tools/clients/fcl-js/wallet-connect).
