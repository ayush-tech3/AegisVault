# VeilVote — Midnight Zero-Knowledge Private Governance dApp

[![Midnight Privacy dApp CI/CD](https://github.com/ayush-tech3/midnight-privacy-dapp/actions/workflows/ci.yml/badge.svg)](https://github.com/ayush-tech3/midnight-privacy-dapp/actions/workflows/ci.yml)
[![Midnight Compact](https://img.shields.io/badge/Compact-v0.19.0-purple.svg)](https://midnight.network)
[![Tests](https://img.shields.io/badge/Tests-8%20Passing-emerald.svg)](https://github.com/ayush-tech3/midnight-privacy-dapp)
[![Level 3 Submission](https://img.shields.io/badge/RiseIn%20Level%203-First%20Quarter-blue.svg)](https://risein.com)

A decentralized, privacy-preserving governance and secret-ballot voting dApp built natively for the **Midnight Network** utilizing Compact smart contracts and zero-knowledge proofs.

---

## 📌 Level 3 Submission Overview

- **Selected Approved Track:** **Private Voting** (Secret-Ballot DAO & Governance Voting)
- **GitHub Repository:** [https://github.com/ayush-tech3/midnight-privacy-dapp](https://github.com/ayush-tech3/midnight-privacy-dapp)
- **Product Proposal:** [docs/PRODUCT_PROPOSAL.md](docs/PRODUCT_PROPOSAL.md)
- **Privacy Model Specification:** [docs/PRIVACY_MODEL.md](docs/PRIVACY_MODEL.md)

---

## 🔒 Privacy Model: What an Observer Can and Cannot Learn

Midnight's dual-state architecture divides state into public on-chain ledger state and client-side private witness state:

### What an Observer CAN Learn (Public On-Chain Ledger)
- The proposal identifier, title, description, options, and deadline.
- The Merkle root of the eligible voter commitment allowlist.
- The set of spent **nullifiers** preventing double-voting.
- The aggregated final vote tally for each option.
- The lifecycle status of the proposal (Active vs Closed).

### What an Observer CANNOT Learn (Shielded Private Witness)
- **Voter Identity / Address:** Who cast a specific vote (shielded by zero-knowledge Merkle membership proof).
- **Individual Choice:** Which option any specific voter chose (shielded in client-side private witness).
- **Cross-Proposal Linkability:** Correlation of a voter across multiple proposals is impossible because nullifiers are salted by unique proposal IDs: `Hash(voterSecret, proposalId)`.

---

## 🧪 Automated Test Suite (8 Passing Tests)

VeilVote includes 8 automated unit and integration tests verifying cryptographic constraints, state machine transitions, and zero-knowledge privacy guarantees:

1. **Proposal Initialization:** Verifies contract ledger setup, Merkle root registration, and zeroed tallies.
2. **Confidential Vote Casting:** Proves voter eligibility via ZK witness, computes nullifier, and increments tallies.
3. **Double-Voting Prevention:** Detects and rejects duplicate nullifier submissions for the same proposal.
4. **Ineligible Voter Rejection:** Rejects voters who cannot provide a valid Merkle authentication proof.
5. **Observer Privacy Invariant:** Cryptographically guarantees that an external observer cannot link nullifiers to voter secrets or choices.
6. **Proposal Closure Protection:** Enforces proposal closure and rejects votes after finalization.
7. **Option Bounds Validation:** Rejects out-of-bounds ballot option indices.
8. **Per-Proposal Nullifier Isolation:** Verifies that a voter can participate in multiple independent proposals without nullifier collisions.

### Running Tests Locally

```bash
# Run tests across workspace
npm test

# Run contract tests directly
npm run test:contract
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/ayush-tech3/midnight-privacy-dapp.git
cd midnight-privacy-dapp

# Install all monorepo dependencies
npm install
```

### Running the Application

```bash
# Start local development server
npm run dev
```

Open your browser at `http://localhost:5173` to explore the interactive dApp, switch voter identities, generate zero-knowledge ballots, and inspect the real-time Privacy Matrix.

### Building for Production

```bash
# Build contracts and frontend bundle
npm run build
```

---

## 📁 Repository Structure

```
midnight-privacy-dapp/
├── .github/workflows/
│   └── ci.yml                  # Automated CI/CD pipeline
├── contract/
│   ├── src/
│   │   ├── index.compact       # Midnight Compact smart contract
│   │   ├── crypto.ts           # Nullifiers, commitments & Merkle tree engine
│   │   ├── zk-voting-engine.ts # Contract state machine & ZK verifier
│   │   └── types.ts            # Contract interfaces & types
│   └── tests/
│       └── voting.test.ts      # 8 Automated Vitest tests
├── frontend/
│   ├── src/
│   │   ├── components/         # UI components & Privacy Inspector
│   │   ├── services/           # Midnight Lace & Prover client
│   │   ├── App.tsx             # Main dApp layout
│   │   └── index.css           # Glassmorphic dark theme design system
│   ├── index.html
│   └── vite.config.ts
├── docs/
│   ├── PRODUCT_PROPOSAL.md     # Detailed Level 3 submission proposal
│   └── PRIVACY_MODEL.md        # In-depth observer leakage analysis
├── package.json                # Monorepo root configuration
└── README.md
```

---

## 📄 License
MIT License. Developed for Rise In / Midnight Level 3 Certification.
