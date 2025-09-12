import * as fcl from "@onflow/fcl";

const ACCESS_NODE = process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE || "https://rest-testnet.onflow.org";
const WALLET_DISCOVERY = process.env.NEXT_PUBLIC_FLOW_WALLET_DISCOVERY || "https://fcl-discovery.onflow.org/testnet/authn";
const APP_TITLE = process.env.NEXT_PUBLIC_APP_TITLE || "ChargeShare";
const APP_ICON = process.env.NEXT_PUBLIC_APP_ICON || "https://placehold.co/64x64";
const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "";

fcl.config()
  .put("app.detail.title", APP_TITLE)
  .put("app.detail.icon", APP_ICON)
  .put("flow.network", "testnet")
  .put("accessNode.api", ACCESS_NODE)
  .put("discovery.wallet", WALLET_DISCOVERY)
  // WalletConnect v2 project id (recommended)
  .put("fcl.plugins.walletconnect.projectId", WC_PROJECT_ID);

export default fcl;

