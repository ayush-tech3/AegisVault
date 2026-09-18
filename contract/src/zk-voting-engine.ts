import { Proposal, ProposalStatus, VoteTally, CastVoteWitness, LedgerState } from './types.js';
import { computeNullifier, computeCommitment, MerkleTree } from './crypto.js';

export class ZkVotingEngine {
  private ledgerState: LedgerState;

  constructor() {
    this.ledgerState = {
      proposals: new Map<string, Proposal>(),
      tallies: new Map<string, VoteTally>(),
      nullifiers: new Set<string>()
    };
  }

  /**
   * Returns current snapshot of the public blockchain ledger state
   */
  public getLedger(): LedgerState {
    return {
      proposals: new Map(this.ledgerState.proposals),
      tallies: new Map(this.ledgerState.tallies),
      nullifiers: new Set(this.ledgerState.nullifiers)
    };
  }

  /**
   * Creates a new voting proposal on the ledger
   */
  public createProposal(params: {
    id: string;
    title: string;
    description: string;
    options: string[];
    eligibilityRoot: string;
    deadline?: number;
  }): Proposal {
    if (this.ledgerState.proposals.has(params.id)) {
      throw new Error(`Proposal ID ${params.id} already exists`);
    }
    if (params.options.length < 2 || params.options.length > 10) {
      throw new Error('Options count must be between 2 and 10');
    }

    const proposal: Proposal = {
      id: params.id,
      title: params.title,
      description: params.description,
      options: params.options,
      optionsCount: params.options.length,
      eligibilityRoot: params.eligibilityRoot,
      deadline: params.deadline || Date.now() + 86400000 * 7,
      status: ProposalStatus.Active,
      totalVotesCast: 0
    };

    const initialTally: VoteTally = {
      proposalId: params.id,
      optionVotes: new Array(params.options.length).fill(0),
      totalTally: 0
    };

    this.ledgerState.proposals.set(params.id, proposal);
    this.ledgerState.tallies.set(params.id, initialTally);

    return proposal;
  }

  /**
   * Executes a confidential vote transition with zero-knowledge verification
   */
  public castVote(proposalId: string, witness: CastVoteWitness, voterIndexInTree: number = 0): { nullifier: string; tally: VoteTally } {
    const proposal = this.ledgerState.proposals.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }
    if (proposal.status !== ProposalStatus.Active) {
      throw new Error(`Proposal ${proposalId} is closed`);
    }

    // 1. ZK Circuit Constraint: Option validity
    if (witness.ballotChoice < 0 || witness.ballotChoice >= proposal.optionsCount) {
      throw new Error(`Invalid ballot choice: ${witness.ballotChoice} is out of bounds (0..${proposal.optionsCount - 1})`);
    }

    // 2. ZK Circuit Constraint: Eligibility proof verification
    const commitment = computeCommitment(witness.voterSecret);
    const isEligible = MerkleTree.verifyProof(
      commitment,
      witness.eligibilityProof,
      proposal.eligibilityRoot,
      voterIndexInTree
    );

    if (!isEligible) {
      throw new Error('Zero-knowledge proof verification failed: Voter is not in the eligibility allowlist');
    }

    // 3. ZK Circuit Constraint: Nullifier uniqueness
    const nullifier = computeNullifier(witness.voterSecret, proposalId);
    if (this.ledgerState.nullifiers.has(nullifier)) {
      throw new Error(`Double voting detected: Nullifier ${nullifier} has already been spent for this proposal`);
    }

    // 4. Update Ledger State (Atomic state transition)
    this.ledgerState.nullifiers.add(nullifier);

    const tally = this.ledgerState.tallies.get(proposalId)!;
    tally.optionVotes[witness.ballotChoice] += 1;
    tally.totalTally += 1;

    proposal.totalVotesCast += 1;

    return { nullifier, tally };
  }

  /**
   * Closes an active proposal
   */
  public closeProposal(proposalId: string): void {
    const proposal = this.ledgerState.proposals.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }
    proposal.status = ProposalStatus.Closed;
  }
}
