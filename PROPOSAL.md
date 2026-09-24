# AegisVault: Product Proposal & Architecture Specification
**Midnight Network Level 1, 2, 3, 4, 5 & 6 Program Submission (Moonshot Moon Phase)**

* **Live Frontend Demo:** [https://aegisvalutmoonlight.netlify.app/](https://aegisvalutmoonlight.netlify.app/)
* **Demo Video (YouTube):** [https://youtu.be/GK1J3Dq58_8](https://youtu.be/GK1J3Dq58_8)
* **Feedback Form:** [Google Form Feedback](https://docs.google.com/forms/d/e/1FAIpQLSc8B1-lgpUGnz39H3KlYNo3V-yldd4yYNl70-3nmYcQYy8vBQ/viewform)
* **Live Survey Responses:** [Google Sheets Live Data](https://docs.google.com/spreadsheets/d/1n4nP22GdS4SpqSIZDI31G1KT46jZx-UVVki-NeH1CEU/edit?usp=sharing)
* **70 Preprod User Wallets:** [`docs/PREPROD_USERS.md`](docs/PREPROD_USERS.md)
* **Product X Profile:** [https://x.com/AegisVaultZK](https://x.com/AegisVaultZK)
* **Repository:** [https://github.com/ayush-tech3/AegisVault](https://github.com/ayush-tech3/AegisVault)
* **Deployed Contract:** `020067426bcdaef449f8754142dbb9ab5794770faee88737bf60dca19ad792b3` (`Midnight Preprod / NetworkId.Preprod`)
* **Environment Config:** [`frontend/src/environments/environment.ts`](frontend/src/environments/environment.ts) (`NetworkId.Preprod`)

### Selected Idea from Provided List (Level 3)
This project implements a combination of two ideas from the official Midnight Moonshot provided idea list:
1. **Private Allowlist Access** — Prove membership (accredited investor KYC) without revealing identity. Borrowers prove they belong to a verified accredited investor Merkle whitelist without exposing their leaf index, public address, or personal KYC documents.
2. **Confidential Credentials** — Prove a credential is valid without disclosing it. The ZK circuit proves that a borrower's RWA collateral meets the ≥150% over-collateralization threshold and that the borrower holds valid accredited investor status — all without revealing the actual collateral value, asset type, or identity.


## 1. Product & Target Users (What Problem Does It Solve?)

### Problem Statement
On traditional transparent blockchains (e.g. Ethereum, Solana), Real-World Asset (RWA) tokenization and institutional lending suffer from severe privacy vulnerabilities:
1. **Predatory Balance-Sheet Exposure:** Institutional borrowers (hedge funds, treasury desks, real estate funds) cannot lock collateral on public chains because competitors and MEV bots can inspect their exact treasury size, health factor, and liquidation price.
2. **Regulatory & Compliance Catch-22:** Public blockchains force a binary choice between total transparency (which violates financial confidentiality laws) and total opacity (e.g., Tornado Cash/Monero, which violates AML/KYC and securities regulations).
3. **Double-Borrowing / Sybil Exploits:** Traditional privacy protocols struggle to prevent double-collateralization without revealing identity.

### Solution: AegisVault
**AegisVault** is an institutional-grade, zero-knowledge Real-World Asset (RWA) collateralization and confidential lending protocol built natively on Midnight. 

Borrowers deposit and lock off-chain RWAs (US Treasury Bills, Corporate Bonds, Commercial Real Estate Equity, Syndicated Private Credit) into shielded vaults. They prove over-collateralization (≥150%) and accredited investor KYC status using client-side zero-knowledge proofs—without disclosing their identity, specific collateral holdings, or portfolio balance to the public ledger. Furthermore, AegisVault implements Midnight's signature **Programmable Selective Disclosure ("Rational Privacy")**, enabling borrowers to grant cryptographically authenticated audit viewing keys to regulatory authorities (SEC, FINRA, ESMA) on demand.

### Target Users
* **Institutional Borrowers & Fund Treasuries:** Entities seeking liquidity against high-grade RWA collateral without leaking balance sheets to market competitors.
* **Accredited & High-Net-Worth Investors:** Borrowers requiring compliance with Reg D / MiCA frameworks while safeguarding personal wealth privacy.
* **Institutional Liquidity Providers:** Yield-seeking capital allocators requiring mathematically guaranteed 150% over-collateralization invariants.
* **Compliance Officers & Regulatory Examiners:** Auditors who receive cryptographically bound viewing tokens to inspect financial solvency without public leaks.

---

## 2. Why Midnight Network?

Midnight is the only layer-1 blockchain engineered specifically for **"Rational Privacy"** through its dual-state paradigm:

1. **Dual-State Separation (Private Witness vs. Public Ledger):**
   - **Private Witness:** The borrower's secret key, exact RWA asset value (e.g., $2,500,000 USD), secret salt, and Merkle authentication path remain strictly inside their local Midnight Lace wallet.
   - **Public Ledger:** The blockchain records only the deterministic commitment hash `Hash(secret, salt, value, asset)`, spent nullifier `Hash(secret, loanId)`, and public debt tallies.
2. **Compact Smart Contract Language (v0.19):**
   - Compact enables high-level declarative expression of complex zero-knowledge circuit constraints (e.g., `(collateralValue * 10000) >= (principalAmount * minRatioBps)`) compiled directly into BLS12-381 PLONK zk-SNARK circuits.
3. **Programmable Selective Disclosure:**
   - Unlike legacy privacy coins that face global regulatory bans, Midnight allows programmable viewing key delegation (`grantAuditorDisclosure`), fulfilling institutional auditability and compliance requirements.

---

## 3. Privacy Data Model & Cryptographic Invariants

### A. Mathematical Circuit Invariants
1. **Collateral Commitment Invariant:**
   $$\text{Commitment} = \text{PoseidonHash}(\text{BorrowerSecret}, \text{Salt}, \text{CollateralValueUSD}, \text{AssetType})$$
2. **150% Over-Collateralization Constraint:**
   $$\text{CollateralValueUSD} \times 10,000 \ge \text{PrincipalAmountUSD} \times \text{MinRatioBps} \quad (\text{where } \text{MinRatioBps} \ge 15,000)$$
3. **Deterministic Borrow Nullifier Invariant (Anti-Double-Borrow):**
   $$\text{Nullifier} = \text{PoseidonHash}(\text{BorrowerSecret}, \text{LoanId})$$
   $$\text{Assert } \text{Nullifier} \notin \text{SpentNullifiers}$$
4. **Accredited Investor Merkle Proof:**
   $$\text{VerifyMerkle}(\text{PoseidonHash}(\text{BorrowerSecret}), \text{MerkleProof}, \text{AccreditedRoot}) = \text{True}$$

### B. Observer vs. Borrower Privacy Matrix

| Data Field | Public Observer / Indexer | Verified Auditor (With Key) | Borrower (Private Witness) |
| :--- | :--- | :--- | :--- |
| **Borrower Identity & Address** | ⛔ SHIELDED (0% Leak) | ⛔ SHIELDED (ZK Proof of KYC) | ✅ Private Local State |
| **Collateral Asset & USD Value** | ⛔ SHIELDED (`0x...` Hash) | ✅ Decrypted via Viewing Key | ✅ Full Unencrypted Access |
| **Over-Collateralization (≥150%)** | ✅ Cryptographically Verified | ✅ Cryptographically Verified | ✅ Full Calculation |
| **Loan Principal & Status** | ✅ Visible on Ledger | ✅ Visible on Ledger | ✅ Visible on Ledger |
| **Double-Borrow Prevention** | ✅ Enforced via Nullifier | ✅ Enforced via Nullifier | ✅ Deterministic Seed |

---

## 4. Mainnet Scope & Roadmap

### Milestone 1: New Moon & Waxing Crescent (Current Release)
- [x] Midnight Compact v0.19 Smart Contract with 4 exported circuits (`depositShieldedCollateral`, `borrowShielded`, `repayLoan`, `grantAuditorDisclosure`).
- [x] Complete `managed/` compiled circuit intermediate representations (`.zkir`) and proving/verifying keys.
- [x] Official Midnight.js SDK integration (`@midnight-ntwrk/midnight-js-network-id`, `@midnight-ntwrk/dapp-connector-api`, `@midnight-ntwrk/compact-runtime`).
- [x] Midnight Lace Wallet connect/disconnect interface with Preprod network detection.
- [x] 8 automated unit tests verifying circuit invariants and CI/CD GitHub Actions pipeline.
- [x] Deployed Preprod Contract Address with network label in `README.md`.

### Milestone 2: First Quarter & Waxing Gibbous
- [ ] Integration with institutional RWA oracle feeds (Chainlink Proof of Reserve / Centrifuge).
- [ ] Multi-asset collateral bundling inside a single zero-knowledge proof.
- [ ] Integration with Midnight Night Sky testnet indexers.

### Milestone 3: Full Moon & Supermoon (Mainnet Launch)
- [ ] Third-party formal verification of Compact ZK circuits.
- [ ] Midnight Mainnet smart contract deployment.
- [ ] Institutional prime brokerage and custodian onboarding (BNY Mellon, State Street Digital).
