import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';

/**
 * AegisVault Midnight Network Production Configuration
 * Target Network: Midnight Preprod
 */
export const environment = {
  production: true,

  // Midnight Network Configuration
  networkId: NetworkId.Preprod,                   // 'preprod'
  networkName: 'Midnight Preprod',

  // Midnight Preprod Service Endpoints
  indexerUrl: 'https://indexer.preprod.midnight.network/api/v1/graphql',
  indexerWsUrl: 'wss://indexer.preprod.midnight.network/api/v1/graphql/ws',
  nodeUrl: 'https://rpc.preprod.midnight.network',
  proofServerUrl: 'http://localhost:6300',

  // Deployed Contract Address on Midnight Preprod
  contractAddress: '020067426bcdaef449f8754142dbb9ab5794770faee88737bf60dca19ad792b3',

  // Accredited Investor Merkle Root
  merkleRoot: '0x7b93f1bc448e89f81a1c90bd192934ec795bb51a94e82df4b4f59cb03de7a192'
};
