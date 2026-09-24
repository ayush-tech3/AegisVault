export enum NetworkId {
  Preprod = 'preprod',
  Preview = 'preview',
  Undeployed = 'undeployed'
}
export function setNetworkId(networkId: NetworkId): void;
export function getNetworkId(): NetworkId;
