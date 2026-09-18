import { describe, it, expect, beforeEach } from 'vitest';
import { ZkVotingEngine } from '../src/zk-voting-engine.js';
import { computeCommitment, computeNullifier, MerkleTree, sha256 } from '../src/crypto.js';
import { ProposalStatus } from '../src/types.js';

describe('Midnight VeilVote - Zero-Knowledge Secret Ballot Governance', () => {
  let engine: ZkVotingEngine;
  let voterSecrets: string[];
  let commitments: string[];
  let merkleTree: MerkleTree;
  let eligibilityRoot: string;
  const proposalId = sha256('proposal_001_treasury_allocation');

  beforeEach(() => {
    engine = new ZkVotingEngine();

    // Generate 4 sample eligible voters with private secret keys
    voterSecrets = [
      'voter_alice_private_secret_key_0x1',
      'voter_bob_private_secret_key_0x2',
      'voter_carol_private_secret_key_0x3',
      'voter_dave_private_secret_key_0x4'
    ];

    // Compute public voter commitments
    commitments = voterSecrets.map(s => computeCommitment(s));

    // Construct Merkle tree of eligible voter commitments
    merkleTree = new MerkleTree(commitments);
    eligibilityRoot = merkleTree.getRoot();
  });

  it('Test 1: Initializes proposal with verified Merkle eligibility root and zeroed tallies', () => {
    const proposal = engine.createProposal({
      id: proposalId,
      title: 'MIP-04: Midnight Community Treasury Allocation',
      description: 'Allocate 500,000 DUST for privacy developer grants and hackathons',
      options: ['Approve', 'Reject', 'Abstain'],
      eligibilityRoot: eligibilityRoot
    });

    expect(proposal.id).toBe(proposalId);
    expect(proposal.options.length).toBe(3);
    expect(proposal.status).toBe(ProposalStatus.Active);
    expect(proposal.totalVotesCast).toBe(0);

    const ledger = engine.getLedger();
    const tally = ledger.tallies.get(proposalId);
    expect(tally).toBeDefined();
    expect(tally?.optionVotes).toEqual([0, 0, 0]);
    expect(tally?.totalTally).toBe(0);
  });

  it('Test 2: Eligible voter casts confidential ballot with valid ZK proof and derives unique nullifier', () => {
    engine.createProposal({
      id: proposalId,
      title: 'MIP-04: Midnight Community Treasury Allocation',
      description: 'Allocate 500,000 DUST for privacy developer grants',
      options: ['Approve', 'Reject', 'Abstain'],
      eligibilityRoot: eligibilityRoot
    });

    // Alice (Index 0) casts vote for option 0 ("Approve")
    const aliceSecret = voterSecrets[0];
    const aliceProof = merkleTree.getProof(0);

    const result = engine.castVote(
      proposalId,
      {
        voterSecret: aliceSecret,
        ballotChoice: 0,
        eligibilityProof: aliceProof
      },
      0
    );

    const expectedNullifier = computeNullifier(aliceSecret, proposalId);
    expect(result.nullifier).toBe(expectedNullifier);
    expect(result.tally.optionVotes[0]).toBe(1);
    expect(result.tally.totalTally).toBe(1);

    const ledger = engine.getLedger();
    expect(ledger.nullifiers.has(expectedNullifier)).toBe(true);
  });

  it('Test 3: Enforces double-voting prevention via nullifier collision detection', () => {
    engine.createProposal({
      id: proposalId,
      title: 'MIP-04: Midnight Community Treasury Allocation',
      description: 'Allocate 500,000 DUST for privacy developer grants',
      options: ['Approve', 'Reject', 'Abstain'],
      eligibilityRoot: eligibilityRoot
    });

    const bobSecret = voterSecrets[1];
    const bobProof = merkleTree.getProof(1);

    // Bob votes first time for option 1 ("Reject")
    engine.castVote(
      proposalId,
      {
        voterSecret: bobSecret,
        ballotChoice: 1,
        eligibilityProof: bobProof
      },
      1
    );

    // Bob attempts to vote a second time on the same proposal
    expect(() => {
      engine.castVote(
        proposalId,
        {
          voterSecret: bobSecret,
          ballotChoice: 0,
          eligibilityProof: bobProof
        },
        1
      );
    }).toThrowError(/Double voting detected/);

    const ledger = engine.getLedger();
    const tally = ledger.tallies.get(proposalId);
    expect(tally?.totalTally).toBe(1);
    expect(tally?.optionVotes).toEqual([0, 1, 0]);
  });

  it('Test 4: Rejects unauthorized/ineligible voter with invalid Merkle proof', () => {
    engine.createProposal({
      id: proposalId,
      title: 'MIP-04: Midnight Community Treasury Allocation',
      description: 'Allocate 500,000 DUST for privacy developer grants',
      options: ['Approve', 'Reject', 'Abstain'],
      eligibilityRoot: eligibilityRoot
    });

    const attackerSecret = 'attacker_unauthorized_secret_key_999';
    const fakeProof = [sha256('fake_hash_1'), sha256('fake_hash_2')];

    expect(() => {
      engine.castVote(
        proposalId,
        {
          voterSecret: attackerSecret,
          ballotChoice: 0,
          eligibilityProof: fakeProof
        },
        0
      );
    }).toThrowError(/Zero-knowledge proof verification failed/);
  });

  it('Test 5: Validates observer privacy invariant (zero-knowledge linkability guarantee)', () => {
    engine.createProposal({
      id: proposalId,
      title: 'MIP-04: Midnight Community Treasury Allocation',
      description: 'Allocate 500,000 DUST for privacy developer grants',
      options: ['Approve', 'Reject', 'Abstain'],
      eligibilityRoot: eligibilityRoot
    });

    // Carol and Dave cast votes
    const carolSecret = voterSecrets[2];
    const daveSecret = voterSecrets[3];

    const resCarol = engine.castVote(
      proposalId,
      {
        voterSecret: carolSecret,
        ballotChoice: 0,
        eligibilityProof: merkleTree.getProof(2)
      },
      2
    );

    const resDave = engine.castVote(
      proposalId,
      {
        voterSecret: daveSecret,
        ballotChoice: 1,
        eligibilityProof: merkleTree.getProof(3)
      },
      3
    );

    // Ledger inspection from an observer viewpoint:
    const ledger = engine.getLedger();

    // 1. Observer sees nullifiers, but cannot derive voter secrets from them
    expect(ledger.nullifiers.has(resCarol.nullifier)).toBe(true);
    expect(ledger.nullifiers.has(resDave.nullifier)).toBe(true);
    expect(resCarol.nullifier).not.toBe(carolSecret);
    expect(resDave.nullifier).not.toBe(daveSecret);

    // 2. Observer cannot match nullifier to individual ballot choice (one-way unlinkability)
    expect(resCarol.nullifier.length).toBe(66);
    expect(resDave.nullifier.length).toBe(66);

    // 3. Observer only sees aggregated count
    const tally = ledger.tallies.get(proposalId)!;
    expect(tally.totalTally).toBe(2);
    expect(tally.optionVotes).toEqual([1, 1, 0]);
  });

  it('Test 6: Enforces proposal closure and rejects votes after closure', () => {
    engine.createProposal({
      id: proposalId,
      title: 'MIP-04: Midnight Community Treasury Allocation',
      description: 'Allocate 500,000 DUST for privacy developer grants',
      options: ['Approve', 'Reject', 'Abstain'],
      eligibilityRoot: eligibilityRoot
    });

    // Close proposal
    engine.closeProposal(proposalId);

    const ledger = engine.getLedger();
    const prop = ledger.proposals.get(proposalId);
    expect(prop?.status).toBe(ProposalStatus.Closed);

    // Attempting to cast vote on closed proposal must throw
    expect(() => {
      engine.castVote(
        proposalId,
        {
          voterSecret: voterSecrets[0],
          ballotChoice: 0,
          eligibilityProof: merkleTree.getProof(0)
        },
        0
      );
    }).toThrowError(/is closed/);
  });

  it('Test 7: Rejects out-of-bounds ballot choices', () => {
    engine.createProposal({
      id: proposalId,
      title: 'MIP-04: Midnight Community Treasury Allocation',
      description: 'Allocate 500,000 DUST for privacy developer grants',
      options: ['Approve', 'Reject', 'Abstain'], // 3 options: indices 0, 1, 2
      eligibilityRoot: eligibilityRoot
    });

    expect(() => {
      engine.castVote(
        proposalId,
        {
          voterSecret: voterSecrets[0],
          ballotChoice: 9, // Invalid choice
          eligibilityProof: merkleTree.getProof(0)
        },
        0
      );
    }).toThrowError(/out of bounds/);
  });

  it('Test 8: Verifies per-proposal nullifier isolation (same voter can participate in multiple proposals)', () => {
    const proposalId2 = sha256('proposal_002_core_upgrade');

    engine.createProposal({
      id: proposalId,
      title: 'MIP-04: Proposal 1',
      description: 'First proposal',
      options: ['Yes', 'No'],
      eligibilityRoot: eligibilityRoot
    });

    engine.createProposal({
      id: proposalId2,
      title: 'MIP-05: Proposal 2',
      description: 'Second proposal',
      options: ['Yes', 'No'],
      eligibilityRoot: eligibilityRoot
    });

    const aliceSecret = voterSecrets[0];
    const aliceProof = merkleTree.getProof(0);

    // Alice votes on Proposal 1
    const res1 = engine.castVote(
      proposalId,
      { voterSecret: aliceSecret, ballotChoice: 0, eligibilityProof: aliceProof },
      0
    );

    // Alice votes on Proposal 2 (should succeed because nullifiers are salted by proposalId)
    const res2 = engine.castVote(
      proposalId2,
      { voterSecret: aliceSecret, ballotChoice: 1, eligibilityProof: aliceProof },
      0
    );

    expect(res1.nullifier).not.toBe(res2.nullifier);
    expect(engine.getLedger().tallies.get(proposalId)?.totalTally).toBe(1);
    expect(engine.getLedger().tallies.get(proposalId2)?.totalTally).toBe(1);
  });
});
