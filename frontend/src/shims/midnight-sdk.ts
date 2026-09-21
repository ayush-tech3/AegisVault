export enum NetworkId {
  Testnet = 'Testnet',
  Mainnet = 'Mainnet',
  Undeployed = 'Undeployed'
}

let currentNetworkId: NetworkId = NetworkId.Testnet;

export function setNetworkId(networkId: NetworkId): void {
  currentNetworkId = networkId;
}

export function getNetworkId(): NetworkId {
  return currentNetworkId;
}

export class CompactRuntimeMock {
  static createWitnessContext(ledger: any, state: any) {
    return { ledger, state };
  }
}
