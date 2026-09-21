export enum NetworkId {
  Testnet = 'Testnet',
  Mainnet = 'Mainnet',
  Undeployed = 'Undeployed'
}
export function setNetworkId(networkId: NetworkId): void;
export function getNetworkId(): NetworkId;
