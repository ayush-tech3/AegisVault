'use strict';
const NetworkId = {
  Preprod: 'preprod',
  Preview: 'preview',
  Undeployed: 'undeployed'
};

let currentNetworkId = NetworkId.Preprod;

function setNetworkId(networkId) {
  currentNetworkId = networkId;
}

function getNetworkId() {
  return currentNetworkId;
}

module.exports = { NetworkId, setNetworkId, getNetworkId };
