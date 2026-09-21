export interface DAppConnectorAPI {
  isEnabled(): Promise<boolean>;
  enable(): Promise<DAppConnectorWalletAPI>;
}

export interface DAppConnectorWalletAPI {
  state(): Promise<any>;
  serviceUriConfig(): Promise<any>;
}
