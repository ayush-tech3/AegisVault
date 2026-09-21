import { VaultAssetType } from '../types';

/**
 * Browser-compatible SHA-256 using window.crypto.subtle
 */
export async function sha256Browser(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return '0x' + hex;
}

/**
 * Computes a random 32-byte hex salt or private key
 */
export function generateRandomHex(byteLength: number = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Computes Shielded Collateral Commitment:
 * Hash(borrowerSecret, salt, collateralValueUSD, assetType)
 */
export async function computeCollateralCommitmentBrowser(
  borrowerSecret: string,
  collateralValueUSD: number,
  assetType: VaultAssetType,
  salt: string
): Promise<string> {
  return sha256Browser(`aegis:collateral:${borrowerSecret}:${salt}:${collateralValueUSD}:${assetType}`);
}

/**
 * Computes deterministic borrow nullifier:
 * Hash(borrowerSecret, loanId)
 */
export async function computeBorrowNullifierBrowser(
  borrowerSecret: string,
  loanId: string
): Promise<string> {
  return sha256Browser(`aegis:nullifier:${borrowerSecret}:${loanId}`);
}

/**
 * Computes Accredited Investor commitment
 */
export async function computeInvestorCommitmentBrowser(borrowerSecret: string): Promise<string> {
  return sha256Browser(`aegis:investor:${borrowerSecret}`);
}
