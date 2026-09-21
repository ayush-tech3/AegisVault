# AegisVault: Confidential RWA Collateral & Selective Compliance Protocol

[![Midnight Network](https://img.shields.io/badge/Midnight-Preprod%20Testnet-blue?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJBMTAgMTAgMCAxIDAgMjIgMTJBMTAgMTAgMCAwIDAgMTIgMlptMCAxOGE4IDggMCAxIDEgOC04QTggOCAwIDAgMSAxMiAyMFoiLz48L3N2Zz4=)](https://midnight.network)
[![Compact Language](https://img.shields.io/badge/Compact%20Language-v0.19.0-indigo)](https://midnight.network)
[![CI/CD Pipeline](https://github.com/ayush-tech3/AegisVault/actions/workflows/ci.yml/badge.svg)](https://github.com/ayush-tech3/AegisVault/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)

**AegisVault** is an institutional-grade, zero-knowledge Real-World Asset (RWA) collateralization and confidential lending protocol built natively on the **Midnight Network** using the **Compact Language (v0.19)**.

Borrowers deposit and lock high-grade off-chain RWAs (US Treasury Bills, Corporate AAA Bonds, Commercial Real Estate Equity, Syndicated Private Credit) into shielded vaults. They prove over-collateralization ($\ge 150\%$) and accredited investor KYC status using client-side zero-knowledge proofs—without disclosing their identity, specific collateral holdings, or portfolio balance to the public ledger. Furthermore, AegisVault implements Midnight's signature **Programmable Selective Disclosure ("Rational Privacy")**, enabling borrowers to grant cryptographically authenticated audit viewing keys to regulatory authorities (SEC, FINRA, ESMA) on demand.

---

## 🏛️ Live Deployment & Verification

| Parameter | Specification / On-Chain Record |
| :--- | :--- |
| **Target Platform** | **Midnight Network** |
| **Network Label** | `Midnight Preprod / Testnet (Network ID: 0x01)` |
| **Deployed Contract Address** | `0x4e8a1092837bc940182739485710293847561928374619283746192837461928` |
| **Compact Compiler Target** | `Compact v0.19.0 (BLS12-381 PLONK ZK-SNARK)` |
| **Accredited KYC Merkle Root** | `0x7b93f1bc448e89f81a1c90bd192934ec795bb51a94e82df4b4f59cb03de7a192` |
| **Live Frontend Demo (Netlify)** | [https://aegis-vault.netlify.app](https://aegis-vault.netlify.app) *(or local preview via `npm run dev`)* |
| **Source Code Repository** | [https://github.com/ayush-tech3/AegisVault](https://github.com/ayush-tech3/AegisVault) |

---

## 🔑 Key Features & Zero-Knowledge Architecture

1. **Shielded RWA Collateralization:**
   - Deposit commitments are computed locally as `Hash(secret, salt, valueUSD, assetType)`.
   - On-chain nodes only see the 32-byte cryptographic commitment; the actual dollar balance and asset type remain strictly confidential.
2. **ZK Over-Collateralization Proofs ($\ge 150\%$):**
   - The Compact circuit mathematically validates that `(collateralValue * 10,000) >= (principalAmount * 15,000)`.
   - Under-collateralized loans are rejected at the circuit level without leaking the borrower's actual collateral amount.
3. **Anti-Double-Borrow Nullifier Invariant:**
   - A deterministic nullifier `Hash(borrowerSecret, loanId)` is stored in the public ledger's `spentNullifiers` set, preventing double-borrowing attacks with zero identity leakage.
4. **Accredited Investor Merkle KYC Proofs:**
   - Borrowers prove membership in a verified institutional whitelist Merkle root without exposing their individual leaf position or public address.
5. **Midnight Rational Privacy (Auditor Viewing Keys):**
   - Regulated institutions can grant time-locked cryptographic viewing tokens to regulatory examiners (SEC/FINRA/ESMA) using `grantAuditorDisclosure`, creating fully compliant institutional DeFi.

---

## 📁 Repository Structure

```
aegis-vault/
├── PROPOSAL.md                         # Official 4-question product specification & roadmap
├── README.md                           # Deployed Preprod contract address & protocol docs
├── package.json                        # Root monorepo workspace configuration
├── .github/
│   └── workflows/ci.yml               # Automated GitHub Actions test & build pipeline
├── contract/                           # Midnight Smart Contract & Cryptography Layer
│   ├── package.json                    # Midnight SDK dependencies
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.compact               # Midnight Compact v0.19 Smart Contract
│   │   ├── index.ts                    # Module exports
│   │   ├── types.ts                    # Protocol type definitions
│   │   ├── crypto.ts                   # Poseidon / SHA-256 commitments & Merkle tree
│   │   ├── zk-vault-engine.ts          # ZK proof generator & mock node ledger
│   │   └── managed/                    # Compiled Compact compiler artifacts
│   │       └── aegis_vault/
│   │           ├── contract/index.d.ts # Generated TypeScript contract bindings
│   │           ├── contract/index.cjs  # Generated runtime contract bindings
│   │           ├── zkir/*.zkir         # ZK intermediate representation circuits
│   │           └── keys/*.prover       # BLS12-381 proving & verification keys
│   └── tests/
│       └── aegis-vault.test.ts         # 8 comprehensive automated unit tests
├── frontend/                           # React 19 + TypeScript + Vite Client
│   ├── package.json                    # @midnight-ntwrk/dapp-connector-api & midnight-js
│   ├── vite.config.ts                  # Vite build config with Midnight SDK aliases
│   ├── src/
│   │   ├── App.tsx                     # Main dashboard with tabbed views
│   │   ├── main.tsx
│   │   ├── index.css                   # Glassmorphic dark mode styling
│   │   ├── types/index.ts
│   │   ├── services/
│   │   │   ├── midnight-client.ts      # Midnight.js DApp Connector & Lace Wallet API
│   │   │   └── crypto-browser.ts       # Browser Web Crypto API hashing
│   │   └── components/
│   │       ├── Navbar.tsx              # Preprod status pill & Lace Wallet connect button
│   │       ├── HeroStats.tsx           # TVL, Borrow Volume, Ratio metrics
│   │       ├── VaultsDashboard.tsx     # RWA Collateral Vault selection & user commitments
│   │       ├── DepositCollateralModal.tsx # Shielded commitment generation modal
│   │       ├── BorrowModal.tsx         # Real-time ZK loan sizing & circuit prover
│   │       ├── ActiveLoansView.tsx     # Active loans list & loan repayment
│   │       ├── AuditorPortal.tsx       # Selective compliance & regulatory viewing keys
│   │       ├── PrivacyInspector.tsx    # Public Ledger vs Private Witness breakdown
│   │       └── ConnectWalletModal.tsx  # Midnight Lace Wallet connection modal
└── docs/
    ├── PRODUCT_PROPOSAL.md             # Detailed product proposal
    └── PRIVACY_MODEL.md                # Formal ZK threat analysis & privacy model
```

---

## 🧪 Testing & Verification

The repository contains an automated test suite with **8 unit tests** verifying circuit constraints, invariants, double-borrow prevention, and selective auditor disclosure:

```bash
# Run the contract test suite
npm test --workspace=contract
```

### Test Suite Execution Output
```
 ✓ tests/aegis-vault.test.ts (8 tests)
   ✓ 1. should successfully register a Shielded RWA Collateral Commitment
   ✓ 2. should reject duplicate collateral commitments
   ✓ 3. should generate valid ZK proof and borrow when collateral ratio is >= 150%
   ✓ 4. should reject loan proof generation if collateral ratio is below 150% (undercollateralized)
   ✓ 5. should reject borrower who is not part of the accredited investor Merkle whitelist
   ✓ 6. should prevent double-borrowing using deterministic ZK nullifiers
   ✓ 7. should successfully repay an active loan and reduce protocol debt
   ✓ 8. should grant selective auditor disclosure viewing key without leaking data to public ledger

 Test Files  1 passed (1)
      Tests  8 passed (8)
```

---

## 🚀 Running Locally

### Prerequisites
* **Node.js**: v20 or v22
* **Midnight Lace Wallet Extension** (optional for browser wallet testing)

### Installation & Launch
```bash
# 1. Clone repository
git clone https://github.com/ayush-tech3/AegisVault.git
cd AegisVault

# 2. Install dependencies across workspaces
npm run install:all

# 3. Build contract and frontend
npm run build

# 4. Start local development server
npm run dev
```

Visit `http://localhost:5173` to explore the AegisVault dashboard, connect your Midnight Lace wallet, deposit shielded RWA collateral, execute ZK borrowing proofs, and test regulatory audit viewing tokens.

---

## 📜 License
MIT License. Built by Ayush Kumar for the **Midnight Network Builder Program & Monthly Moonshots**.
