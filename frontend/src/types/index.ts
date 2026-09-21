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

export interface ShieldedVaultAsset {
  id: string;
  name: string;
  ticker: string;
  assetType: VaultAssetType;
  apr: number;
  totalDepositedUSD: number;
  minRatioPercent: number; // e.g., 150%
  underlyingRating: string;
  custodian: string;
  icon: string;
}

export interface ShieldedCollateralRecord {
  commitmentHash: string;
  assetType: VaultAssetType;
  assetName: string;
  depositedAmountUSD: number; // Known only client-side
  minRatioBps: number;
  timestamp: number;
  secretKey: string;
  salt: string;
  status: 'Deposited' | 'BorrowedAgainst' | 'Unlocked';
}

export interface ActiveLoanRecord {
  loanId: string;
  principalAmountUSD: number;
  collateralCommitmentHash: string;
  interestRateBps: number;
  accreditedRoot: string;
  nullifier: string;
  status: LoanStatus;
  createdAt: number;
  borrowerAddress: string;
  zkProofHash: string;
}

export interface AuditorDisclosureRecord {
  loanId: string;
  auditorOrganization: string;
  auditorKeyCommitment: string;
  encryptedViewingKey: string;
  accessGrantedAt: number;
  status: 'Active' | 'Revoked';
  verifiedComplianceTag: string;
}

export interface LaceWalletState {
  isConnected: boolean;
  address: string | null;
  networkId: 'preprod' | 'testnet' | 'mainnet' | 'undeployed';
  balanceTDUST: number;
  isConnecting: boolean;
  error: string | null;
}
