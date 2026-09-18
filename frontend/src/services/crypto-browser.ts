// Browser-native cryptographic hashing and Merkle tree generator

export async function sha256Browser(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return '0x' + hashHex;
}

export function computeCommitmentSync(voterSecret: string): string {
  // Synchronous deterministic hash for instant UI feedback
  let hash = 0;
  for (let i = 0; i < voterSecret.length; i++) {
    hash = (hash << 5) - hash + voterSecret.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}a98f4e21d643bc509e81bca6120894fe83210943`;
}

export async function computeCommitment(voterSecret: string): Promise<string> {
  return sha256Browser(`voter:commitment:${voterSecret}`);
}

export async function computeNullifier(voterSecret: string, proposalId: string): Promise<string> {
  return sha256Browser(`voter:nullifier:${voterSecret}:${proposalId}`);
}

export class MerkleTreeBrowser {
  private leaves: string[];
  private layers: string[][];

  constructor(leaves: string[]) {
    this.leaves = leaves.map(l => (l.startsWith('0x') ? l : '0x' + l));
    this.layers = [this.leaves];
  }

  public async build(): Promise<void> {
    let currentLayer = this.layers[0];
    if (currentLayer.length === 0) {
      const emptyRoot = await sha256Browser('empty_root');
      this.layers.push([emptyRoot]);
      return;
    }

    while (currentLayer.length > 1) {
      const nextLayer: string[] = [];
      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i];
        const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : left;
        const parent = await sha256Browser(`${left}:${right}`);
        nextLayer.push(parent);
      }
      this.layers.push(nextLayer);
      currentLayer = nextLayer;
    }
  }

  public getRoot(): string {
    const top = this.layers[this.layers.length - 1];
    return top && top[0] ? top[0] : '0x0000000000000000000000000000000000000000000000000000000000000000';
  }

  public getProof(index: number): string[] {
    const proof: string[] = [];
    let idx = index;

    for (let layerIdx = 0; layerIdx < this.layers.length - 1; layerIdx++) {
      const layer = this.layers[layerIdx];
      const isRight = idx % 2 === 1;
      const siblingIdx = isRight ? idx - 1 : idx + 1;

      if (siblingIdx < layer.length) {
        proof.push(layer[siblingIdx]);
      } else {
        proof.push(layer[idx]);
      }
      idx = Math.floor(idx / 2);
    }
    return proof;
  }
}
