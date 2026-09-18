export enum ProposalStatus {
  Active = 0,
  Closed = 1
}

export interface Proposal {
  id: string; // Hex 32 bytes
  title: string;
  description: string;
  options: string[];
  optionsCount: number;
  eligibilityRoot: string;
  deadline: number;
  status: ProposalStatus;
  totalVotesCast: number;
}

export interface VoteTally {
  proposalId: string;
  optionVotes: number[];
  totalTally: number;
}

export interface PrivateVoterCredentials {
  voterSecret: string; // 32-byte private key/secret
  voterCommitment: string; // Hash(voterSecret)
  merkleProof: string[]; // Merkle authentication path to eligibilityRoot
}

export interface CastVoteWitness {
  voterSecret: string;
  ballotChoice: number;
  eligibilityProof: string[];
}

export interface PublicVoteTransaction {
  proposalId: string;
  nullifier: string;
  proof: string; // zk-SNARK proof data
  timestamp: number;
}

export interface LedgerState {
  proposals: Map<string, Proposal>;
  tallies: Map<string, VoteTally>;
  nullifiers: Set<string>;
}
