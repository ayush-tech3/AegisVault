import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<T> = {
  getBorrowerSecret(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
  getCollateralValueUSD(context: __compactRuntime.WitnessContext<Ledger, T>): [T, bigint];
  getAssetType(context: __compactRuntime.WitnessContext<Ledger, T>): [T, number];
  getCollateralSalt(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
  getAccreditedMerkleProof(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array[]];
  getAuditorViewingKey(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
};

export type ImpureCircuits<T> = {
  depositShieldedCollateral(
    context: __compactRuntime.CircuitContext<T>,
    commitmentHash: Uint8Array,
    minRatioBps: number,
    timestamp: bigint
  ): __compactRuntime.CircuitResults<T, void>;

  borrowShielded(
    context: __compactRuntime.CircuitContext<T>,
    loanId: Uint8Array,
    principalAmount: bigint,
    accreditedRoot: Uint8Array,
    interestRateBps: number,
    timestamp: bigint
  ): __compactRuntime.CircuitResults<T, void>;

  repayLoan(
    context: __compactRuntime.CircuitContext<T>,
    loanId: Uint8Array
  ): __compactRuntime.CircuitResults<T, void>;

  grantAuditorDisclosure(
    context: __compactRuntime.CircuitContext<T>,
    loanId: Uint8Array,
    auditorKeyCommitment: Uint8Array,
    encryptedViewingKey: Uint8Array,
    timestamp: bigint
  ): __compactRuntime.CircuitResults<T, void>;
};

export type PureCircuits = {
  computeCollateralCommitment(
    secret: Uint8Array,
    valueUSD: bigint,
    assetType: number,
    salt: Uint8Array
  ): Uint8Array;
  computeBorrowNullifier(secret: Uint8Array, loanId: Uint8Array): Uint8Array;
  computeInvestorCommitment(secret: Uint8Array): Uint8Array;
};

export type Circuits<T> = ImpureCircuits<T> & PureCircuits;

export type Ledger = {
  readonly collateralCommitments: __compactRuntime.ContractStateMap<Uint8Array, any>;
  readonly activeLoans: __compactRuntime.ContractStateMap<Uint8Array, any>;
  readonly spentNullifiers: __compactRuntime.ContractStateSet<Uint8Array>;
  readonly auditorDisclosures: __compactRuntime.ContractStateMap<Uint8Array, any>;
  readonly totalProtocolBorrowed: bigint;
  readonly totalCollateralCommitmentsCount: bigint;
};

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>): __compactRuntime.ConstructorResult<T>;
}
