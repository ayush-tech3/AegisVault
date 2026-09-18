# VeilVote — Midnight Zero-Knowledge Private Governance dApp

[![CI/CD](https://github.com/ayush-tech3/midnight-privacy-dapp/actions/workflows/ci.yml/badge.svg)](https://github.com/ayush-tech3/midnight-privacy-dapp/actions/workflows/ci.yml)
[![Midnight Compact](https://img.shields.io/badge/Compact-v0.19.0-purple.svg)](https://midnight.network)
[![Tests](https://img.shields.io/badge/Tests-8%20Passing-brightgreen.svg)](#-automated-test-suite-8-passing-tests)
[![Level 3 Submission](https://img.shields.io/badge/RiseIn%20Level%203-First%20Quarter-blue.svg)](https://risein.com)

A decentralized, privacy-preserving governance and secret-ballot voting dApp built natively for the **Midnight Network**. VeilVote allows eligible voters to cast cryptographically shielded ballots using zero-knowledge proofs, preventing voter identity leakage, vote correlation, and double-voting.

---

## 📌 Level 3 Submission Overview

| Item | Details |
| :--- | :--- |
| **Selected Approved Track** | **Private Voting** (Secret-Ballot DAO & Governance Voting) |
| **GitHub Repository** | [github.com/ayush-tech3/midnight-privacy-dapp](https://github.com/ayush-tech3/midnight-privacy-dapp) |
| **Product Proposal** | [docs/PRODUCT_PROPOSAL.md](docs/PRODUCT_PROPOSAL.md) |
| **Privacy Model** | [docs/PRIVACY_MODEL.md](docs/PRIVACY_MODEL.md) |
| **CI/CD Status** | [GitHub Actions](https://github.com/ayush-tech3/midnight-privacy-dapp/actions/workflows/ci.yml) |

---

## ❓ Problem Statement

On-chain governance in transparent blockchains suffers from critical privacy issues:

- **Voter Intimidation & Retaliation:** On Ethereum-style chains, every vote is publicly linked to a wallet address — whales, team members, and contributors are exposed to coercion or bribery.
- **Bandwagon & Herding Effects:** Early visible votes bias late voters, distorting true consensus.
- **Privacy vs. Verifiability Trade-off:** Off-chain solutions like Snapshot sacrifice censorship resistance and on-chain verifiable execution.

---

## 💡 Solution: VeilVote

VeilVote is a privacy-first governance protocol built natively on Midnight's dual-state zero-knowledge architecture. Eligible voters cast cryptographically shielded ballots that are verified and tallied on-chain without ever revealing *who* voted for *which* option.

### Key Features

- **True Secret Ballot Governance:** Individual ballot choices are processed entirely inside the client-side private witness state — never exposed on the public ledger.
- **Double-Voting Prevention via ZK Nullifiers:** A deterministic nullifier `Hash(voterSecret, proposalId)` is published on-chain per vote. The Compact contract ensures each secret key produces exactly one nullifier per proposal.
- **Allowlist & Sybil Resistance:** Voters prove membership in a Merkle commitment tree without revealing their specific leaf, index, or identity.
- **Proposal Lifecycle Management:** Create proposals with 2–6 options, cast shielded ballots, finalize proposals, and inspect results.
- **Real-Time Privacy Inspector:** Visual dual-pane tool showing exactly what an on-chain observer can and cannot learn.
- **Wallet Connect/Disconnect:** Supports Midnight Lace Wallet detection with automatic fallback to the local prover.

---

## 🏗️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| Smart Contract | Midnight Compact v0.19 (zero-knowledge circuit & state machine) |
| Cryptographic Engine | SHA-256 commitments, deterministic nullifiers, Merkle tree proofs |
| Frontend Framework | React 19 + TypeScript + Vite |
| Testing Framework | Vitest (8 automated tests) |
| CI/CD | GitHub Actions |
| Wallet Integration | Midnight Lace DApp Connector / Local Prover Provider |
| Styling | Custom CSS with glassmorphic dark theme, Outfit & JetBrains Mono fonts |

---

## 🔒 Privacy Model: What an Observer Can and Cannot Learn

Midnight's core architectural differentiator is its **dual-state paradigm** — public ledger state vs. private witness state. VeilVote applies this model to confidential governance:

### ✅ What an Observer CAN See (Public On-Chain Ledger)

| Data | Visibility |
| :--- | :--- |
| Proposal ID, title, description, options, deadline | Public |
| Merkle root of the eligible voter commitment allowlist | Public |
| Set of spent nullifiers (prevents double-voting) | Public |
| Aggregated vote tally per option | Public |
| Proposal lifecycle status (Active / Closed) | Public |

### ❌ What an Observer CANNOT See (Shielded Private Witness)

| Data | Protection Mechanism |
| :--- | :--- |
| **Voter identity / wallet address** | Shielded by zero-knowledge Merkle membership proof |
| **Individual ballot choice** | Kept in client-side private witness, never transmitted |
| **Voter secret key** | Kept exclusively in browser memory |
| **Merkle authentication path** | Used inside the ZK circuit, never published |
| **Cross-proposal linkability** | Nullifiers are salted by unique proposal IDs |

> **Key Privacy Guarantee:** Even if an observer knows a specific individual participated in a vote, they cannot determine *which* option that individual selected. Nullifiers are deterministic one-way hashes that cannot be reversed to recover the voter's secret or choice.

For a detailed analysis, see [docs/PRIVACY_MODEL.md](docs/PRIVACY_MODEL.md).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x (tested with v20 and v24)
- **npm** >= 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/ayush-tech3/midnight-privacy-dapp.git
cd midnight-privacy-dapp

# Install all monorepo dependencies
npm install
```

### Running Locally

```bash
# Start the development server
npm run dev
```

Open your browser at **http://localhost:5173** to use the dApp.

### Building for Production

```bash
# Build both contract and frontend packages
npm run build
```

### Running Tests

```bash
# Run the full test suite (8 tests)
npm test
```

---

## 🧪 Automated Test Suite (8 Passing Tests)

All tests are located in [`contract/tests/voting.test.ts`](contract/tests/voting.test.ts) and run via Vitest:

| # | Test | What It Verifies |
| :--- | :--- | :--- |
| 1 | Proposal Initialization | Ledger setup, Merkle root registration, zeroed tallies |
| 2 | Confidential Vote Casting | ZK eligibility proof, nullifier derivation, tally increment |
| 3 | Double-Voting Prevention | Duplicate nullifier rejection (`Hash(secret, proposalId)`) |
| 4 | Ineligible Voter Rejection | Invalid Merkle proof triggers verification failure |
| 5 | Observer Privacy Invariant | Nullifiers are unlinkable to voter secrets or choices |
| 6 | Proposal Closure Protection | Votes rejected after proposal finalization |
| 7 | Option Bounds Validation | Out-of-range ballot choices rejected |
| 8 | Per-Proposal Nullifier Isolation | Same voter can participate across independent proposals |

```
 ✓ tests/voting.test.ts (8 tests) 8ms
 Test Files  1 passed (1)
      Tests  8 passed (8)
```

---

## 🔄 CI/CD

The project uses **GitHub Actions** for continuous integration:

- **Workflow:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
- **Badge:** [![CI/CD](https://github.com/ayush-tech3/midnight-privacy-dapp/actions/workflows/ci.yml/badge.svg)](https://github.com/ayush-tech3/midnight-privacy-dapp/actions/workflows/ci.yml)
- **Pipeline Steps:** Install → Typecheck Contract → Run 8 Tests → Typecheck Frontend → Build Frontend

---

## 🌐 Deployment / Live Demo

The frontend can be deployed to any static hosting provider:

```bash
# Build the production bundle
npm run build

# The output is in frontend/dist/ — deploy this folder
```

**Recommended deployment targets:** Vercel, Netlify, or GitHub Pages.

To deploy on Vercel:
1. Import the GitHub repository at [vercel.com/new](https://vercel.com/new)
2. Set **Root Directory** to `frontend`
3. Set **Build Command** to `npm run build` (or `tsc && vite build`)
4. Set **Output Directory** to `dist`
5. Deploy

---

## 📄 Product Proposal

The full product proposal is available at [docs/PRODUCT_PROPOSAL.md](docs/PRODUCT_PROPOSAL.md) and covers:

1. **Executive Summary** — Why private governance matters
2. **Key Value Propositions** — Secret ballots, nullifier-based double-vote prevention, Merkle allowlists
3. **Architecture & Tech Stack** — Compact contracts, SHA-256 commitments, React frontend
4. **User Journey & Flow** — Proposal creation → Credential loading → ZK proof generation → On-chain transition → Verification

---

## 📁 Project Structure

```
midnight-privacy-dapp/
├── .github/workflows/
│   └── ci.yml                  # GitHub Actions CI/CD pipeline
├── contract/
│   ├── src/
│   │   ├── index.compact       # Midnight Compact smart contract (ZK circuit)
│   │   ├── crypto.ts           # SHA-256 hashing, nullifiers, Merkle tree engine
│   │   ├── zk-voting-engine.ts # Contract state machine & ZK verification
│   │   ├── types.ts            # TypeScript interfaces & data models
│   │   └── index.ts            # Package entry point
│   ├── tests/
│   │   └── voting.test.ts      # 8 automated Vitest tests
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx          # Nav bar with wallet & identity controls
│   │   │   ├── ProposalCard.tsx    # Proposal display with live tally bars
│   │   │   ├── CastVoteModal.tsx   # ZK ballot casting with step feedback
│   │   │   ├── CreateProposalModal.tsx # Proposal creation form
│   │   │   ├── PrivacyInspector.tsx   # Dual-state privacy matrix
│   │   │   └── ComplianceBadge.tsx    # Level 3 compliance display
│   │   ├── services/
│   │   │   ├── midnight-client.ts  # Midnight DApp connector & state manager
│   │   │   └── crypto-browser.ts   # Browser-side crypto hashing & Merkle tree
│   │   ├── types/
│   │   │   └── index.ts           # Frontend type definitions
│   │   ├── App.tsx                # Main application layout
│   │   ├── main.tsx               # React entry point
│   │   └── index.css              # Glassmorphic dark theme design system
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   ├── PRODUCT_PROPOSAL.md     # Level 3 product proposal
│   └── PRIVACY_MODEL.md        # Observer privacy leakage analysis
├── package.json                # Monorepo root (npm workspaces)
├── package-lock.json
├── .gitignore
└── README.md
```

---

## 📄 License

MIT License. Developed by Ayush Kumar for Rise In / Midnight Level 3 – First Quarter Certification.
