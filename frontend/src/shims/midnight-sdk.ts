export enum NetworkId {
  Preprod = 'preprod',
  Preview = 'preview',
  Undeployed = 'undeployed'
}

let currentNetworkId: NetworkId = NetworkId.Preprod;

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
