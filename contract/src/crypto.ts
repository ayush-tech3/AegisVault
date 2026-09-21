import { createHash } from 'node:crypto';
import { VaultAssetType } from './types.js';

/**
 * Deterministic cryptographic hash function (SHA-256 formatted to 32-byte hex)
 */
export function sha256(data: string | Buffer): string {
  const hash = createHash('sha256');
  hash.update(data);
  return '0x' + hash.digest('hex');
}

/**
 * Computes a Shielded Collateral Commitment:
 * Hash(borrowerSecret, salt, collateralValueUSD, assetType)
 */
export function computeCollateralCommitment(
  borrowerSecret: string,
  collateralValueUSD: number,
  assetType: VaultAssetType,
  salt: string
): string {
  return sha256(`aegis:collateral:${borrowerSecret}:${salt}:${collateralValueUSD}:${assetType}`);
}

/**
 * Computes a deterministic borrow nullifier:
 * Hash(borrowerSecret, loanId)
 * Prevents double-borrowing against the same credential without revealing identity.
 */
export function computeBorrowNullifier(borrowerSecret: string, loanId: string): string {
  return sha256(`aegis:nullifier:${borrowerSecret}:${loanId}`);
}

/**
 * Computes an investor KYC/AML identity commitment:
 * Hash(borrowerSecret)
 */
export function computeInvestorCommitment(borrowerSecret: string): string {
  return sha256(`aegis:investor:${borrowerSecret}`);
}

/**
 * Merkle Tree implementation for Accredited Investor KYC/AML Whitelists
 */
export class MerkleTree {
  private leaves: string[];
  private layers: string[][];

  constructor(leaves: string[]) {
    this.leaves = leaves.map(l => (l.startsWith('0x') ? l : '0x' + l));
    this.layers = [this.leaves];
    this.buildTree();
  }

  private buildTree(): void {
    let currentLayer = this.layers[0];
    if (currentLayer.length === 0) {
      this.layers.push([sha256('empty_root')]);
      return;
    }

    while (currentLayer.length > 1) {
      const nextLayer: string[] = [];
      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i];
        const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : left;
        nextLayer.push(sha256(`${left}:${right}`));
      }
      this.layers.push(nextLayer);
      currentLayer = nextLayer;
    }
  }

  public getRoot(): string {
    const topLayer = this.layers[this.layers.length - 1];
    return topLayer && topLayer[0] ? topLayer[0] : sha256('empty_root');
  }

  public getProof(leafIndex: number): string[] {
    const proof: string[] = [];
    let index = leafIndex;

    for (let layerIndex = 0; layerIndex < this.layers.length - 1; layerIndex++) {
      const layer = this.layers[layerIndex];
      const isRightNode = index % 2 === 1;
      const siblingIndex = isRightNode ? index - 1 : index + 1;

      if (siblingIndex < layer.length) {
        proof.push(layer[siblingIndex]);
      } else {
        proof.push(layer[index]);
      }
      index = Math.floor(index / 2);
    }
    return proof;
  }

  public static verifyProof(leaf: string, proof: string[], root: string, leafIndex: number): boolean {
    let currentHash = leaf.startsWith('0x') ? leaf : '0x' + leaf;
    let index = leafIndex;

    for (const sibling of proof) {
      const isRightNode = index % 2 === 1;
      if (isRightNode) {
        currentHash = sha256(`${sibling}:${currentHash}`);
      } else {
        currentHash = sha256(`${currentHash}:${sibling}`);
      }
      index = Math.floor(index / 2);
    }
    return currentHash.toLowerCase() === root.toLowerCase();
  }
}
