import {
  VaultAssetType,
  LoanStatus,
  ShieldedCollateralCommitment,
  LoanAgreement,
  AuditorDisclosureRecord,
  PrivateWitnessData,
  ZkProofPayload
} from './types.js';
import {
  sha256,
  computeCollateralCommitment,
  computeBorrowNullifier,
  computeInvestorCommitment,
  MerkleTree
} from './crypto.js';

export class AegisVaultEngine {
  // Public Ledger Maps (simulating Midnight node ledger state)
  public collateralCommitments: Map<string, ShieldedCollateralCommitment> = new Map();
  public activeLoans: Map<string, LoanAgreement> = new Map();
  public spentNullifiers: Set<string> = new Set();
  public auditorDisclosures: Map<string, AuditorDisclosureRecord> = new Map();
  public totalProtocolBorrowed: number = 0;
  public totalCollateralCommitmentsCount: number = 0;

  /**
   * 1. Register a Shielded Collateral Commitment onto the public ledger
   */
  public depositShieldedCollateral(
    commitmentHash: string,
    minRatioBps: number = 15000, // 150%
    timestamp: number = Date.now()
  ): ShieldedCollateralCommitment {
    if (this.collateralCommitments.has(commitmentHash)) {
      throw new Error('Collateral commitment already registered');
    }
    if (minRatioBps < 12000) {
      throw new Error('Minimum collateral ratio must be at least 120% (12000 bps)');
    }

    const commitment: ShieldedCollateralCommitment = {
      commitmentHash,
      timestamp,
      minRatioBps
    };

    this.collateralCommitments.set(commitmentHash, commitment);
    this.totalCollateralCommitmentsCount++;
    return commitment;
  }

  /**
   * 2. Generate Client-Side ZK Witness & Proof for borrowing
   */
  public generateBorrowProof(
    loanId: string,
    principalAmount: number,
    accreditedRoot: string,
    witness: PrivateWitnessData
  ): ZkProofPayload {
    // 1. Verify Commitment derivation
    const computedCommitment = computeCollateralCommitment(
      witness.borrowerSecret,
      witness.collateralValueUSD,
      witness.assetType,
      witness.salt
    );

    // 2. Enforce Over-Collateralization Constraint: (Collateral Value * 10,000) >= (Principal * 15,000)
    const requiredRatio = 15000;
    const meetsRatio = (witness.collateralValueUSD * 10000) >= (principalAmount * requiredRatio);
    if (!meetsRatio) {
      throw new Error(
        `Circuit constraint failed: Insufficient collateral ($${witness.collateralValueUSD}) for loan ($${principalAmount}) at 150% ratio`
      );
    }

    // 3. Verify Merkle Proof of Accredited Investor Status
    const investorCommitment = computeInvestorCommitment(witness.borrowerSecret);
    const isMember = MerkleTree.verifyProof(
      investorCommitment,
      witness.merkleProof,
      accreditedRoot,
      witness.leafIndex
    );
    if (!isMember) {
      throw new Error('Circuit constraint failed: Borrower is not a verified accredited investor');
    }

    // 4. Derive deterministic nullifier
    const nullifier = computeBorrowNullifier(witness.borrowerSecret, loanId);

    // 5. Generate mock ZK-SNARK proof bytes
    const proofBytes = sha256(
      `zk-proof:borrowShielded:${loanId}:${computedCommitment}:${nullifier}:${accreditedRoot}`
    );

    return {
      circuit: 'borrowShielded',
      proofBytes,
      publicInputs: {
        loanId,
        principalAmount,
        commitmentHash: computedCommitment,
        accreditedRoot,
        nullifier
      }
    };
  }

  /**
   * 3. Submit Borrow Transition to Midnight Node Ledger
   */
  public borrowShielded(
    loanId: string,
    principalAmount: number,
    accreditedRoot: string,
    interestRateBps: number,
    proofPayload: ZkProofPayload,
    timestamp: number = Date.now()
  ): LoanAgreement {
    if (this.activeLoans.has(loanId)) {
      throw new Error('Loan ID already exists');
    }
    if (principalAmount <= 0) {
      throw new Error('Loan principal must be greater than zero');
    }

    const { commitmentHash, nullifier } = proofPayload.publicInputs;

    if (!this.collateralCommitments.has(commitmentHash)) {
      throw new Error('Collateral commitment not found in registered vaults');
    }

    if (this.spentNullifiers.has(nullifier)) {
      throw new Error('Double borrow detected: Collateral nullifier already spent');
    }

    this.spentNullifiers.add(nullifier);

    const loan: LoanAgreement = {
      loanId,
      principalAmount,
      interestRateBps,
      accreditedRoot,
      nullifier,
      status: LoanStatus.Active,
      createdAt: timestamp
    };

    this.activeLoans.set(loanId, loan);
    this.totalProtocolBorrowed += principalAmount;
    return loan;
  }

  /**
   * 4. Repay Shielded Loan
   */
  public repayLoan(loanId: string): LoanAgreement {
    const loan = this.activeLoans.get(loanId);
    if (!loan) {
      throw new Error('Loan agreement does not exist');
    }
    if (loan.status !== LoanStatus.Active) {
      throw new Error('Loan is not active');
    }

    loan.status = LoanStatus.Repaid;
    this.activeLoans.set(loanId, loan);
    this.totalProtocolBorrowed = Math.max(0, this.totalProtocolBorrowed - loan.principalAmount);
    return loan;
  }

  /**
   * 5. Grant Selective Auditor Disclosure (Midnight Rational Privacy)
   */
  public grantAuditorDisclosure(
    loanId: string,
    auditorKeyCommitment: string,
    encryptedViewingKey: string,
    timestamp: number = Date.now()
  ): AuditorDisclosureRecord {
    if (!this.activeLoans.has(loanId)) {
      throw new Error('Loan agreement does not exist');
    }

    const record: AuditorDisclosureRecord = {
      loanId,
      auditorKeyCommitment,
      encryptedViewingKey,
      timestamp
    };

    this.auditorDisclosures.set(loanId, record);
    return record;
  }
}
