# Product Proposal: VeilVote — Midnight Zero-Knowledge Private Governance

**Track:** Private Voting (Approved Level 3 Idea List)  
**Target Platform:** Midnight Network (Compact Language v0.19)  
**Author / Developer:** Ayush Kumar  
**Repository:** [https://github.com/ayush-tech3/midnight-privacy-dapp](https://github.com/ayush-tech3/midnight-privacy-dapp)

---

## 1. Executive Summary
Decentralized Autonomous Organizations (DAOs) and on-chain governance systems currently suffer from transparency drawbacks:
- **Voter Intimidation & Retaliation:** On transparent blockchains (e.g. Ethereum), every vote is linked to an address, exposing whales, contributors, and team members to coercion or bribery.
- **Bandwagon & Herding Effects:** Early visible votes bias late voters, skewing true consensus.
- **Privacy Trade-offs:** Existing off-chain solutions (like Snapshot) compromise on censorship resistance and on-chain verifiable execution.

**VeilVote** is a privacy-first decentralized governance protocol built natively on Midnight. It allows eligible voters to cast cryptographically shielded ballots using zero-knowledge proofs. Observers and blockchain indexers can verify voter eligibility and aggregate tallies without ever learning *who* cast *which* vote.

---

## 2. Key Value Propositions
1. **True Secret Ballot Governance:** Individual ballot choices (Yes/No/Options) are processed entirely inside the client-side private witness state.
2. **Double-Voting Prevention via ZK Nullifiers:** A deterministic nullifier `Hash(voterSecret, proposalId)` is recorded on the public ledger when a vote is cast. The contract ensures that each secret key can only submit one nullifier per proposal without revealing the secret key or identity.
3. **Allowlist & Sybil Resistance via Merkle Trees:** Voters prove membership in a governance allowlist root without disclosing their specific leaf or index.
4. **Trustless & Verifiable Tallying:** Results are aggregated on-chain in real-time or upon proposal closure, ensuring verifiable execution.

---

## 3. Architecture & Tech Stack
- **Smart Contract Layer:** Midnight Compact (v0.19) smart contract defining public ledger maps (`proposals`, `tallies`, `nullifiers`) and private witness routines (`getVoterSecret`, `getBallotChoice`, `getEligibilityProof`).
- **Cryptographic Engine:** SHA-256 / Poseidon zero-knowledge commitments, nullifier generation, and Merkle tree proof verification.
- **Client Application:** React 19 + TypeScript + Vite with Midnight Lace Wallet and local prover simulator support.
- **CI/CD & Testing:** Automated GitHub Actions pipeline running Vitest test suite and TypeScript builds.

---

## 4. User Journey & Flow
1. **Proposal Creation:** A DAO admin or delegate creates a proposal specifying options and uploading an eligibility Merkle root of voter commitments.
2. **Credential Loading:** The voter connects their Midnight Lace wallet or loads their shielded credential.
3. **ZK Proof Generation:** In the browser, the client builds the private witness (voter secret, chosen option, Merkle proof).
4. **On-Chain Transition:** The Compact circuit validates the proof and emits a spent nullifier while incrementing the proposal tally.
5. **Observation & Verification:** Public observers can inspect the ledger, verify cryptographic invariants, and audit final outcomes with zero identity leakage.
