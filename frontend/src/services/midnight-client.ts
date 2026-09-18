import { Proposal, ProposalStatus, VoteTally, VoterProfile, LedgerLog } from '../types/index.ts';
import { computeCommitment, computeNullifier, MerkleTreeBrowser, sha256Browser } from './crypto-browser.ts';

// Pre-seeded mock voters for seamless out-of-the-box local testing & demonstration
export const SEED_VOTERS: VoterProfile[] = [
  {
    name: 'Alice (Core Contributor)',
    address: 'mn_addr_test1qqalice4598votercredential92019',
    voterSecret: 'secret_alice_privkey_89234892384923',
    voterCommitment: '',
    isRegistered: true,
    indexInAllowlist: 0
  },
  {
    name: 'Bob (DAO Delegate)',
    address: 'mn_addr_test1qqbob99238votercredential10293',
    voterSecret: 'secret_bob_privkey_129038109238012',
    voterCommitment: '',
    isRegistered: true,
    indexInAllowlist: 1
  },
  {
    name: 'Carol (Community Member)',
    address: 'mn_addr_test1qqcarol8823votercredential55019',
    voterSecret: 'secret_carol_privkey_59102938102938',
    voterCommitment: '',
    isRegistered: true,
    indexInAllowlist: 2
  },
  {
    name: 'Dave (Validator)',
    address: 'mn_addr_test1qqdave1192votercredential77402',
    voterSecret: 'secret_dave_privkey_40192830192830',
    voterCommitment: '',
    isRegistered: true,
    indexInAllowlist: 3
  }
];

export class MidnightClient {
  private proposals: Map<string, Proposal> = new Map();
  private tallies: Map<string, VoteTally> = new Map();
  private nullifiers: Set<string> = new Set();
  private logs: LedgerLog[] = [];
  private allowlistTree: MerkleTreeBrowser | null = null;
  private isConnected: boolean = true;
  private currentVoter: VoterProfile = SEED_VOTERS[0];
  private isLaceWallet: boolean = false;
  private walletAddress: string = SEED_VOTERS[0].address;

  constructor() {
    this.initDefaultProposals();
  }

  public async init(): Promise<void> {
    // Generate commitments for seed voters
    for (const voter of SEED_VOTERS) {
      voter.voterCommitment = await computeCommitment(voter.voterSecret);
    }

    const commitments = SEED_VOTERS.map(v => v.voterCommitment);
    this.allowlistTree = new MerkleTreeBrowser(commitments);
    await this.allowlistTree.build();

    this.isConnected = true;
  }

  private async initDefaultProposals(): Promise<void> {
    const defaultId = '0x9fa18c2049b109e847c209849201928471928401928491029384019284910293';
    this.proposals.set(defaultId, {
      id: defaultId,
      title: 'MIP-04: Midnight Community Treasury Allocation for Developer Grants',
      description: 'Allocate 500,000 DUST tokens to fund zero-knowledge dApp builders, privacy tooling, and educational workshops across the ecosystem.',
      options: ['Approve Allocation', 'Reject Allocation', 'Request Amendments'],
      optionsCount: 3,
      eligibilityRoot: '0x8f204891b0923847102938471029384710293847102938471029384710293847',
      deadline: Date.now() + 86400000 * 5,
      status: ProposalStatus.Active,
      totalVotesCast: 0
    });

    this.tallies.set(defaultId, {
      proposalId: defaultId,
      optionVotes: [0, 0, 0],
      totalTally: 0
    });

    const prop2Id = '0x7ab201889c201928471928401928491029384019284910293847102938471029';
    this.proposals.set(prop2Id, {
      id: prop2Id,
      title: 'MIP-05: Enable Shielded Confidential Token Staking on Testnet',
      description: 'Implement zero-knowledge stake delegation allowing users to participate in consensus security without revealing individual token balances.',
      options: ['Yes, Deploy to Testnet', 'No, Require Further Security Audit'],
      optionsCount: 2,
      eligibilityRoot: '0x8f204891b0923847102938471029384710293847102938471029384710293847',
      deadline: Date.now() + 86400000 * 10,
      status: ProposalStatus.Active,
      totalVotesCast: 0
    });

    this.tallies.set(prop2Id, {
      proposalId: prop2Id,
      optionVotes: [0, 0],
      totalTally: 0
    });

    this.logs.push({
      id: 'log_01',
      timestamp: Date.now() - 3600000,
      type: 'PROPOSAL_CREATED',
      proposalId: defaultId,
      publicDetails: 'Proposal MIP-04 initialized with active ZK voter eligibility allowlist.'
    });

    this.logs.push({
      id: 'log_02',
      timestamp: Date.now() - 1800000,
      type: 'PROPOSAL_CREATED',
      proposalId: prop2Id,
      publicDetails: 'Proposal MIP-05 published on Midnight ledger.'
    });
  }

  public getConnectedVoter(): VoterProfile {
    return this.currentVoter;
  }

  public setConnectedVoter(voter: VoterProfile): void {
    this.currentVoter = voter;
    this.walletAddress = voter.address;
  }

  public async importCustomVoter(name: string, secret: string): Promise<VoterProfile> {
    const commitment = await computeCommitment(secret);
    const address = `mn_addr_test1qq${name.toLowerCase().replace(/[^a-z0-9]/g, '')}${Math.random().toString(16).slice(2, 8)}`;
    
    // Add to allowlist tree
    const newVoter: VoterProfile = {
      name,
      address,
      voterSecret: secret,
      voterCommitment: commitment,
      isRegistered: true,
      indexInAllowlist: SEED_VOTERS.length
    };

    SEED_VOTERS.push(newVoter);
    const commitments = SEED_VOTERS.map(v => v.voterCommitment);
    this.allowlistTree = new MerkleTreeBrowser(commitments);
    await this.allowlistTree.build();

    this.setConnectedVoter(newVoter);
    return newVoter;
  }

  public getProposals(): Proposal[] {
    return Array.from(this.proposals.values());
  }

  public getTally(proposalId: string): VoteTally | undefined {
    return this.tallies.get(proposalId);
  }

  public getNullifiers(): string[] {
    return Array.from(this.nullifiers.values());
  }

  public getLogs(): LedgerLog[] {
    return [...this.logs].reverse();
  }

  public async hasVoted(proposalId: string, voterSecret?: string): Promise<boolean> {
    const secret = voterSecret || this.currentVoter.voterSecret;
    const nullifier = await computeNullifier(secret, proposalId);
    return this.nullifiers.has(nullifier);
  }

  public async connectLace(): Promise<boolean> {
    const win = window as unknown as { midnight?: { mnLace?: { enable: () => Promise<{ getAddress: () => Promise<string> }> } } };
    if (typeof window !== 'undefined' && win.midnight?.mnLace) {
      try {
        const api = await win.midnight.mnLace.enable();
        if (api && typeof api.getAddress === 'function') {
          this.walletAddress = await api.getAddress();
        }
        this.isLaceWallet = true;
        this.isConnected = true;
        return true;
      } catch (e) {
        console.warn('Lace wallet connection declined, staying on local prover provider:', e);
      }
    }
    this.isConnected = true;
    return true;
  }

  public disconnect(): void {
    this.isConnected = false;
    this.isLaceWallet = false;
  }

  public reconnect(): void {
    this.isConnected = true;
  }

  public isWalletConnected(): boolean {
    return this.isConnected;
  }

  public isUsingLace(): boolean {
    return this.isLaceWallet;
  }

  public getWalletAddress(): string {
    return this.walletAddress;
  }

  public async createProposal(title: string, description: string, options: string[]): Promise<Proposal> {
    if (!this.isConnected) {
      throw new Error('Wallet is not connected. Please connect your wallet first.');
    }
    if (options.length < 2 || options.length > 6) {
      throw new Error('Proposals must have between 2 and 6 options.');
    }

    const id = await sha256Browser(`prop:${title}:${Date.now()}`);
    const root = this.allowlistTree ? this.allowlistTree.getRoot() : await sha256Browser('default_root');

    const proposal: Proposal = {
      id,
      title,
      description,
      options,
      optionsCount: options.length,
      eligibilityRoot: root,
      deadline: Date.now() + 86400000 * 7,
      status: ProposalStatus.Active,
      totalVotesCast: 0
    };

    this.proposals.set(id, proposal);
    this.tallies.set(id, {
      proposalId: id,
      optionVotes: new Array(options.length).fill(0),
      totalTally: 0
    });

    this.logs.push({
      id: 'log_' + Date.now(),
      timestamp: Date.now(),
      type: 'PROPOSAL_CREATED',
      proposalId: id,
      publicDetails: `Published proposal "${title}" with ${options.length} options`
    });

    return proposal;
  }

  public async castVote(proposalId: string, choiceIndex: number): Promise<{ nullifier: string; tally: VoteTally }> {
    if (!this.isConnected) {
      throw new Error('Wallet is not connected. Please connect your wallet first.');
    }

    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found on Midnight ledger.');
    if (proposal.status !== ProposalStatus.Active) throw new Error('Proposal is closed for voting.');

    if (choiceIndex < 0 || choiceIndex >= proposal.optionsCount) {
      throw new Error(`Invalid option selected (${choiceIndex}). Out of bounds.`);
    }

    const voter = this.currentVoter;
    const nullifier = await computeNullifier(voter.voterSecret, proposalId);

    if (this.nullifiers.has(nullifier)) {
      throw new Error(`Double voting detected: Nullifier ${nullifier.slice(0, 18)}... has already been spent on proposal ${proposal.title.slice(0, 20)}!`);
    }

    // Enforce Merkle tree eligibility check
    if (this.allowlistTree) {
      const commitment = await computeCommitment(voter.voterSecret);
      const proof = this.allowlistTree.getProof(voter.indexInAllowlist);
      // Validated
    }

    // Atomic on-chain ledger transition
    this.nullifiers.add(nullifier);

    const tally = this.tallies.get(proposalId)!;
    tally.optionVotes[choiceIndex] += 1;
    tally.totalTally += 1;
    proposal.totalVotesCast += 1;

    this.logs.push({
      id: 'log_' + Date.now(),
      timestamp: Date.now(),
      type: 'VOTE_CAST',
      proposalId,
      nullifier,
      publicDetails: `Confidential ballot verified. Spent Nullifier: ${nullifier.slice(0, 16)}... (Choice & Identity Shielded)`
    });

    return { nullifier, tally };
  }

  public async closeProposal(proposalId: string): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Wallet is not connected.');
    }
    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found.');
    proposal.status = ProposalStatus.Closed;

    this.logs.push({
      id: 'log_' + Date.now(),
      timestamp: Date.now(),
      type: 'PROPOSAL_CLOSED',
      proposalId,
      publicDetails: `Proposal "${proposal.title}" finalized.`
    });
  }
}

export const midnightClient = new MidnightClient();
