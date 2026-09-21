'use strict';
const NetworkId = {
  Testnet: 'Testnet',
  Mainnet: 'Mainnet',
  Undeployed: 'Undeployed'
};

let currentNetworkId = NetworkId.Testnet;

function setNetworkId(networkId) {
  currentNetworkId = networkId;
}

function getNetworkId() {
  return currentNetworkId;
}

module.exports = { NetworkId, setNetworkId, getNetworkId };
