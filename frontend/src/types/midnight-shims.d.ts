declare module '@midnight-ntwrk/midnight-js-network-id' {
  export enum NetworkId {
    Preprod = 'preprod',
    Preview = 'preview',
    Undeployed = 'undeployed'
  }
  export function setNetworkId(networkId: NetworkId): void;
  export function getNetworkId(): NetworkId;
}

declare module '@midnight-ntwrk/dapp-connector-api' {
  export interface DAppConnectorAPI {
    isEnabled(): Promise<boolean>;
    enable(): Promise<DAppConnectorWalletAPI>;
  }

  export interface DAppConnectorWalletAPI {
    state(): Promise<any>;
    serviceUriConfig(): Promise<any>;
  }
}

declare module '@midnight-ntwrk/compact-runtime' {
  export type WitnessContext<L, T> = any;
  export type CircuitContext<T> = any;
  export type ConstructorContext<T> = any;
  export type CircuitResults<T, R> = { context: CircuitContext<T>; result: R };
  export type ConstructorResult<T> = { currentContractState: any };
  export type ContractStateMap<K, V> = Map<K, V>;
  export type ContractStateSet<K> = Set<K>;
}
