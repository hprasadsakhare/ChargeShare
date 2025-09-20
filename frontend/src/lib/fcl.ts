import * as fcl from "@onflow/fcl";
import { init } from "@onflow/fcl-wc";

const ACCESS_NODE = process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE || "https://rest-testnet.onflow.org";
const WALLET_DISCOVERY = process.env.NEXT_PUBLIC_FLOW_WALLET_DISCOVERY || "https://fcl-discovery.onflow.org/testnet/authn";
const APP_TITLE = process.env.NEXT_PUBLIC_APP_TITLE || "ChargeShare";
const APP_ICON = process.env.NEXT_PUBLIC_APP_ICON || "https://placehold.co/64x64";
const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Initialize WalletConnect if project ID is provided
const initializeWalletConnect = async () => {
  if (!WC_PROJECT_ID) {
    console.warn(`
[FCL WalletConnect Service Plugin]
============================
WalletConnect project ID not found. Some wallets may not work properly.
To fix this:
1. Get a project ID from: https://cloud.walletconnect.com
2. Add NEXT_PUBLIC_WC_PROJECT_ID=your_project_id to your .env.local file
3. Restart the development server
============================
    `);
    return;
  }

  try {
    const { FclWcServicePlugin } = await init({
      projectId: WC_PROJECT_ID,
      metadata: {
        name: APP_TITLE,
        description: "ChargeShare - EV Charging Station Sharing Platform",
        url: APP_URL,
        icons: [APP_ICON],
      },
    });
    
    fcl.pluginRegistry.add(FclWcServicePlugin);
    console.log("WalletConnect Service Plugin initialized successfully");
  } catch (error) {
    console.error("Failed to initialize WalletConnect Service Plugin:", error);
  }
};

// Initialize WalletConnect
initializeWalletConnect();

fcl.config()
  .put("app.detail.title", APP_TITLE)
  .put("app.detail.icon", APP_ICON)
  .put("flow.network", "testnet")
  .put("accessNode.api", ACCESS_NODE)
  .put("discovery.wallet", WALLET_DISCOVERY);

export default fcl;

