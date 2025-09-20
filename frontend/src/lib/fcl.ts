import * as fcl from "@onflow/fcl";
import { init } from "@onflow/fcl-wc";

const ACCESS_NODE = process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE || "https://rest-testnet.onflow.org";
const WALLET_DISCOVERY = process.env.NEXT_PUBLIC_FLOW_WALLET_DISCOVERY || "https://fcl-discovery.onflow.org/testnet/authn";
const APP_TITLE = process.env.NEXT_PUBLIC_APP_TITLE || "ChargeShare";
const APP_ICON = process.env.NEXT_PUBLIC_APP_ICON || "https://placehold.co/64x64";
const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Initialize WalletConnect if project ID is provided
if (WC_PROJECT_ID) {
  init({
    projectId: WC_PROJECT_ID,
    metadata: {
      name: APP_TITLE,
      description: "ChargeShare - EV Charging Station Sharing Platform",
      url: APP_URL,
      icons: [APP_ICON],
    },
  }).then(({ FclWcServicePlugin }) => {
    fcl.pluginRegistry.add(FclWcServicePlugin);
  });
}

fcl.config()
  .put("app.detail.title", APP_TITLE)
  .put("app.detail.icon", APP_ICON)
  .put("flow.network", "testnet")
  .put("accessNode.api", ACCESS_NODE)
  .put("discovery.wallet", WALLET_DISCOVERY);

export default fcl;

