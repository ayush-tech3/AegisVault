import { describe, it, expect, beforeEach } from 'vitest';
import {
  AegisVaultEngine,
  VaultAssetType,
  LoanStatus,
  computeCollateralCommitment,
  computeBorrowNullifier,
  computeInvestorCommitment,
  MerkleTree,
  PrivateWitnessData
} from '../src/index.js';

describe('AegisVault Midnight Smart Contract & ZK Cryptographic Engine', () => {
  let engine: AegisVaultEngine;
  let accreditedTree: MerkleTree;
  let validInvestorSecret: string;
  let validInvestorCommitment: string;
  let unlistedInvestorSecret: string;
  let root: string;

  beforeEach(() => {
    engine = new AegisVaultEngine();

    validInvestorSecret = '0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff';
    unlistedInvestorSecret = '0x9999999999999999999999999999999999999999999999999999999999999999';

    validInvestorCommitment = computeInvestorCommitment(validInvestorSecret);
    const otherCommitment1 = computeInvestorCommitment('0xabc123');
    const otherCommitment2 = computeInvestorCommitment('0xdef456');

    accreditedTree = new MerkleTree([validInvestorCommitment, otherCommitment1, otherCommitment2]);
    root = accreditedTree.getRoot();
  });

  it('1. should successfully register a Shielded RWA Collateral Commitment', () => {
    const salt = '0xsalt123';
    const collateralValueUSD = 500000; // $500,000 in T-Bills
    const assetType = VaultAssetType.USTreasuryBills;

    const commitment = computeCollateralCommitment(validInvestorSecret, collateralValueUSD, assetType, salt);
    const record = engine.depositShieldedCollateral(commitment, 15000);

    expect(record.commitmentHash).toBe(commitment);
    expect(record.minRatioBps).toBe(15000);
    expect(engine.collateralCommitments.has(commitment)).toBe(true);
    expect(engine.totalCollateralCommitmentsCount).toBe(1);
  });

  it('2. should reject duplicate collateral commitments', () => {
    const commitment = '0xduplicatedcommitmenthash1234567890';
    engine.depositShieldedCollateral(commitment, 15000);

    expect(() => {
      engine.depositShieldedCollateral(commitment, 15000);
    }).toThrow('Collateral commitment already registered');
  });

  it('3. should generate valid ZK proof and borrow when collateral ratio is >= 150%', () => {
    const salt = '0xsalt123';
    const collateralValueUSD = 300000; // $300,000 RWA collateral
    const principalAmount = 100000; // $100,000 loan -> 300% ratio (passes >= 150%)
    const assetType = VaultAssetType.USTreasuryBills;
    const loanId = '0xloan001';

    const commitment = computeCollateralCommitment(validInvestorSecret, collateralValueUSD, assetType, salt);
    engine.depositShieldedCollateral(commitment, 15000);

    const witness: PrivateWitnessData = {
      borrowerSecret: validInvestorSecret,
      collateralValueUSD,
      assetType,
      salt,
      merkleProof: accreditedTree.getProof(0),
      leafIndex: 0
    };

    const proof = engine.generateBorrowProof(loanId, principalAmount, root, witness);
    expect(proof.circuit).toBe('borrowShielded');
    expect(proof.publicInputs.loanId).toBe(loanId);
    expect(proof.publicInputs.nullifier).toBeDefined();

    const loan = engine.borrowShielded(loanId, principalAmount, root, 450, proof);
    expect(loan.status).toBe(LoanStatus.Active);
    expect(loan.principalAmount).toBe(principalAmount);
    expect(engine.totalProtocolBorrowed).toBe(principalAmount);
    expect(engine.spentNullifiers.has(proof.publicInputs.nullifier)).toBe(true);
  });

  it('4. should reject loan proof generation if collateral ratio is below 150% (undercollateralized)', () => {
    const salt = '0xsalt123';
    const collateralValueUSD = 100000; // $100,000 collateral
    const principalAmount = 90000; // $90,000 loan -> ~111% ratio (< 150% required)
    const assetType = VaultAssetType.CorporateBonds;
    const loanId = '0xloan_undercollateralized';

    const commitment = computeCollateralCommitment(validInvestorSecret, collateralValueUSD, assetType, salt);
    engine.depositShieldedCollateral(commitment, 15000);

    const witness: PrivateWitnessData = {
      borrowerSecret: validInvestorSecret,
      collateralValueUSD,
      assetType,
      salt,
      merkleProof: accreditedTree.getProof(0),
      leafIndex: 0
    };

    expect(() => {
      engine.generateBorrowProof(loanId, principalAmount, root, witness);
    }).toThrow(/Insufficient collateral/);
  });

  it('5. should reject borrower who is not part of the accredited investor Merkle whitelist', () => {
    const salt = '0xsalt999';
    const collateralValueUSD = 500000;
    const principalAmount = 100000;
    const assetType = VaultAssetType.PrivateCredit;
    const loanId = '0xloan_unauthorized';

    const commitment = computeCollateralCommitment(unlistedInvestorSecret, collateralValueUSD, assetType, salt);
    engine.depositShieldedCollateral(commitment, 15000);

    const witness: PrivateWitnessData = {
      borrowerSecret: unlistedInvestorSecret,
      collateralValueUSD,
      assetType,
      salt,
      merkleProof: accreditedTree.getProof(0), // invalid proof for unlisted secret
      leafIndex: 0
    };

    expect(() => {
      engine.generateBorrowProof(loanId, principalAmount, root, witness);
    }).toThrow(/not a verified accredited investor/);
  });

  it('6. should prevent double-borrowing using deterministic ZK nullifiers', () => {
    const salt = '0xsalt123';
    const collateralValueUSD = 500000;
    const principalAmount = 100000;
    const assetType = VaultAssetType.CommercialRealEstate;
    const loanId1 = '0xloan_first';

    const commitment = computeCollateralCommitment(validInvestorSecret, collateralValueUSD, assetType, salt);
    engine.depositShieldedCollateral(commitment, 15000);

    const witness: PrivateWitnessData = {
      borrowerSecret: validInvestorSecret,
      collateralValueUSD,
      assetType,
      salt,
      merkleProof: accreditedTree.getProof(0),
      leafIndex: 0
    };

    const proof = engine.generateBorrowProof(loanId1, principalAmount, root, witness);
    engine.borrowShielded(loanId1, principalAmount, root, 450, proof);

    // Attempting to submit the same proof / nullifier again
    expect(() => {
      engine.borrowShielded('0xloan_duplicate', principalAmount, root, 450, proof);
    }).toThrow('Double borrow detected: Collateral nullifier already spent');
  });

  it('7. should successfully repay an active loan and reduce protocol debt', () => {
    const salt = '0xsalt123';
    const collateralValueUSD = 400000;
    const principalAmount = 150000;
    const assetType = VaultAssetType.USTreasuryBills;
    const loanId = '0xloan_repay';

    const commitment = computeCollateralCommitment(validInvestorSecret, collateralValueUSD, assetType, salt);
    engine.depositShieldedCollateral(commitment, 15000);

    const witness: PrivateWitnessData = {
      borrowerSecret: validInvestorSecret,
      collateralValueUSD,
      assetType,
      salt,
      merkleProof: accreditedTree.getProof(0),
      leafIndex: 0
    };

    const proof = engine.generateBorrowProof(loanId, principalAmount, root, witness);
    engine.borrowShielded(loanId, principalAmount, root, 450, proof);
    expect(engine.totalProtocolBorrowed).toBe(150000);

    const repaidLoan = engine.repayLoan(loanId);
    expect(repaidLoan.status).toBe(LoanStatus.Repaid);
    expect(engine.totalProtocolBorrowed).toBe(0);
  });

  it('8. should grant selective auditor disclosure viewing key without leaking data to public ledger', () => {
    const salt = '0xsalt123';
    const collateralValueUSD = 600000;
    const principalAmount = 200000;
    const loanId = '0xloan_audited';

    const commitment = computeCollateralCommitment(validInvestorSecret, collateralValueUSD, VaultAssetType.USTreasuryBills, salt);
    engine.depositShieldedCollateral(commitment, 15000);

    const witness: PrivateWitnessData = {
      borrowerSecret: validInvestorSecret,
      collateralValueUSD,
      assetType: VaultAssetType.USTreasuryBills,
      salt,
      merkleProof: accreditedTree.getProof(0),
      leafIndex: 0
    };

    const proof = engine.generateBorrowProof(loanId, principalAmount, root, witness);
    engine.borrowShielded(loanId, principalAmount, root, 450, proof);

    const auditorKeyCommitment = '0xauditor_finra_sec_key_hash_98765';
    const encryptedViewingKey = '0xenc_viewing_payload_aes256gcm_with_rsa_key_for_compliance_dept';

    const disclosure = engine.grantAuditorDisclosure(loanId, auditorKeyCommitment, encryptedViewingKey);
    expect(disclosure.loanId).toBe(loanId);
    expect(disclosure.auditorKeyCommitment).toBe(auditorKeyCommitment);
    expect(engine.auditorDisclosures.has(loanId)).toBe(true);
  });
});
