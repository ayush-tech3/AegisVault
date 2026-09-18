export enum ProposalStatus {
  Active = 0,
  Closed = 1
}

export interface Proposal {
  id: string;
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

export interface VoterProfile {
  name: string;
  address: string;
  voterSecret: string;
  voterCommitment: string;
  isRegistered: boolean;
  indexInAllowlist: number;
}

export interface LedgerLog {
  id: string;
  timestamp: number;
  type: 'PROPOSAL_CREATED' | 'VOTE_CAST' | 'PROPOSAL_CLOSED';
  proposalId: string;
  nullifier?: string;
  publicDetails: string;
}

export interface PrivacyInspectionData {
  publicLedger: {
    proposalId: string;
    nullifiersCount: number;
    tallies: number[];
    nullifiersList: string[];
    contractAddress: string;
  };
  privateWitness: {
    voterSecretHidden: boolean;
    choiceShielded: boolean;
    merkleProofValid: boolean;
    zkProofGenerated: boolean;
  };
}
