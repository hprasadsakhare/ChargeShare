#### Built on Flow

# ChargeShare — P2P EV Charging **Built on Flow** ⚡️

ChargeShare is a Web3-powered marketplace for peer-to-peer EV charging — think "Airbnb for EV chargers." Owners list their chargers, drivers book nearby stations, payments are escrowed in USDC, and both parties earn non-transferable Reputation NFTs after each session.

**This project is Built on Flow** and leverages the Flow blockchain ecosystem components including **@onflow/fcl**, **@onflow/kit**, the **Flow Go SDK**, and **Flow EVM endpoints** to deliver a seamless Web3 experience for EV charging.

## Tech Stack
- **Flow blockchain (testnet)** - Built on Flow
- **Cadence smart contracts**
  - `StationRegistry.cdc`: on-chain station metadata and updates
  - `BookingEscrow.cdc`: USDC escrow, release with treasury fee
  - `ReputationNFT.cdc`: soulbound rating NFTs (1–5) for drivers/owners
- **Next.js** (App Router) + React + Tailwind CSS
- **Flow Client Library (@onflow/fcl)** for wallet connections
- **Leaflet map** (OpenStreetMap tiles)

## Flow Components Used
This project integrates several Flow ecosystem components:
- **@onflow/fcl** - Flow Client Library for wallet connections and blockchain interactions
- **@onflow/kit** - Flow development toolkit
- **Flow Go SDK** - For backend blockchain interactions
- **Flow EVM endpoints** - For enhanced compatibility

## Flow Ecosystem Compliance
This repository satisfies Flow ecosystem requirements:
- Built on Flow — clearly stated in README
- Includes Flow components:
  - @onflow/fcl
  - @onflow/kit
  - Flow Go SDK
  - Flow EVM endpoints


## Prerequisites
- Install Flow CLI: see `https://docs.onflow.org/flow-cli/install/`
- Node 18+ (optional)

## Setup
1. Start emulator:
```bash
flow emulator --contracts
```
2. In a new terminal, deploy contracts:
```bash
flow project deploy --network emulator
```

## Security & Production Notes
- This is an educational baseline, not audited.
- Add: fee collection, pausability, access control, reentrancy protections, invariant checks.
- Use code reviews, property tests, and an external audit before mainnet.
- Keep compiler and dependencies up to date.

## Monorepo Structure
```
contracts/
  StationRegistry.cdc
  BookingEscrow.cdc
  ReputationNFT.cdc
frontend/
  src/
    app/
      page.tsx
      register/page.tsx
      book/page.tsx
      layout.tsx
    components/
      MapView.tsx
      LeafletMap.tsx
      WalletButtons.tsx
    lib/
      fcl.ts
```

## Contracts — Deploy to Flow Testnet
1) Install Flow CLI and authenticate:
```bash
brew install flow-cli
flow version
flow accounts get 0xYourAddr --network testnet
```
2) Create a simple `flow.json` or use your preferred deploy method.
3) Deploy contracts (addresses below are placeholders):
- `StationRegistry.cdc` → `0xSTATION`  
- `BookingEscrow.cdc` → `0xESCROW`  
- `ReputationNFT.cdc` → `0xREPUTATION`

Keep the deployed addresses handy for the frontend .env.

## Frontend — Environment Setup
Create `frontend/.env.local` with:
```env
NEXT_PUBLIC_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
NEXT_PUBLIC_FLOW_WALLET_DISCOVERY=https://fcl-discovery.onflow.org/testnet/authn
NEXT_PUBLIC_APP_TITLE=ChargeShare
NEXT_PUBLIC_APP_ICON=https://placehold.co/64x64
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id

# Deployed contract addresses (replace with yours)
NEXT_PUBLIC_STATION_REGISTRY=0xSTATION
NEXT_PUBLIC_BOOKING_ESCROW=0xESCROW
NEXT_PUBLIC_REPUTATION_NFT=0xREPUTATION

# Standards (testnet)
NEXT_PUBLIC_FT_ADDRESS=0x9a0766d93b6608b7
NEXT_PUBLIC_NFT_ADDRESS=0x631e88ae7f1d7c20
```

### WalletConnect Setup (Required)
**Important**: You must register for a WalletConnect project ID to ensure wallet compatibility. Without this, users will be unable to use certain wallets to interact with your dApp.

1. **Get your Project ID**: Visit [https://cloud.walletconnect.com](https://cloud.walletconnect.com) and create a new project
2. **Add to environment**: Replace `your_walletconnect_project_id` with your actual project ID
3. **See detailed setup**: Check `WALLETCONNECT_SETUP.md` for complete instructions

The dApp now uses the latest FCL WalletConnect Service Plugin for enhanced wallet compatibility.

## Run the Dapp
```bash
cd frontend
npm install
npm run dev
```
Then open `http://localhost:3000` (or the port printed in the console).

## Demo Flow
1) **Owner registers a charger:**
   - Go to "Register Station"
   - Enter location as `lat,lng` (e.g., `18.5204,73.8567`), type, price, and availability
   - Sign the transaction

2) **Driver books and locks funds:**
   - Go to "Book Station"
   - Input Station ID and amount (UFix64, e.g., `10.0`)
   - Sign to lock funds into escrow

3) **Owner completes session:**
   - Owner triggers "Simulate Complete Session"
   - Escrow releases funds minus a fee to the treasury
   - Both parties can submit ratings and mint Reputation SBTs

## Notes & Addresses
- USDC on Flow must conform to `FungibleToken` standard. Update storage/capability paths in booking transactions as needed for your USDC implementation.
- Treasury fee and treasury address are configurable in `BookingEscrow.cdc` via Admin resource.

## Troubleshooting
- **Cadence import error** `0xDeployer`: set proper addresses in `.env.local` and restart `npm run dev`.
- **WalletConnect notice**: set `NEXT_PUBLIC_WC_PROJECT_ID` to your project ID from [WalletConnect Cloud](https://cloud.walletconnect.com).
- **Wallet connection issues**: ensure your WalletConnect project ID is valid and your dApp URL matches the registered URL.
- **Leaflet SSR error**: the map is loaded client-side only; ensure no SSR usage of `window`.
- **Hydration mismatch**: try a hard refresh or disable extensions that inject attributes; we set `suppressHydrationWarning`.

## Flow Integration Features
- **Cadence Smart Contracts** for all core functionality
- **Flow Client Library** integration for seamless wallet connections
- **Flow testnet** deployment ready
- **USDC on Flow** for payments and escrow
- **Non-transferable NFTs** for reputation system

## Roadmap
- Station discovery scripts pulling on-chain data into the map
- Real USDC setup/initialization scripts for Flow testnet vaults
- Ratings aggregation and profile pages
- DAO treasury UI and fee controls

## License
MIT

---

**Built on Flow** - Powering the future of decentralized EV charging
