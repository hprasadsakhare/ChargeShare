declare module '@onflow/fcl-wc' {
  export interface WalletConnectConfig {
    projectId: string;
    metadata: {
      name: string;
      description: string;
      url: string;
      icons: string[];
    };
  }

  export interface WalletConnectResult {
    FclWcServicePlugin: any;
  }

  export function init(config: WalletConnectConfig): Promise<WalletConnectResult>;
}
