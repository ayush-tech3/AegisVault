/**
 * AegisVault TypeScript Definitions for Midnight Network
 */

export enum VaultAssetType {
  USTreasuryBills = 0,
  CorporateBonds = 1,
  CommercialRealEstate = 2,
  PrivateCredit = 3
}

export enum LoanStatus {
  Active = 'Active',
  Repaid = 'Repaid',
  Liquidated = 'Liquidated'
}

export interface ShieldedCollateralCommitment {
  commitmentHash: string;
  timestamp: number;
  minRatioBps: number; // e.g., 15000 = 150%
}

export interface LoanAgreement {
  loanId: string;
  principalAmount: number;
  interestRateBps: number;
  accreditedRoot: string;
  nullifier: string;
  status: LoanStatus;
  createdAt: number;
}

export interface AuditorDisclosureRecord {
  loanId: string;
  auditorKeyCommitment: string;
  encryptedViewingKey: string;
  timestamp: number;
}

export interface PrivateWitnessData {
  borrowerSecret: string;
  collateralValueUSD: number;
  assetType: VaultAssetType;
  salt: string;
  merkleProof: string[];
  leafIndex: number;
}

export interface ZkProofPayload {
  circuit: 'borrowShielded';
  proofBytes: string;
  publicInputs: {
    loanId: string;
    principalAmount: number;
    commitmentHash: string;
    accreditedRoot: string;
    nullifier: string;
  };
}
