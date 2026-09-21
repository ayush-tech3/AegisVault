# Product Proposal: AegisVault — Midnight Confidential RWA Collateral & Selective Compliance Protocol

**Track:** Finance & Real-World Assets (Approved Midnight Request for Startups Track)  
**Target Platform:** Midnight Network (Compact Language v0.19)  
**Author / Developer:** Ayush Kumar  
**Repository:** [https://github.com/ayush-tech3/AegisVault](https://github.com/ayush-tech3/AegisVault)  
**Live Demo (Netlify):** [https://aegisvalutmoonlight.netlify.app/](https://aegisvalutmoonlight.netlify.app/)  
**Network Deployment:** Midnight Preprod / Testnet  
**Contract Address:** `0x4e8a1092837bc940182739485710293847561928374619283746192837461928`

---

## 1. Executive Summary
On transparent blockchains (e.g. Ethereum), institutional borrowers and high-net-worth investors cannot use on-chain lending protocols because exposing their real-world asset collateral, balance sheet, and liquidation thresholds to the public invites front-running, competitor surveillance, and predatory liquidations.

**AegisVault** resolves the conflict between transparency and confidentiality on the Midnight Network:
- **Zero-Knowledge Over-Collateralization:** Borrowers lock high-grade RWAs (US T-Bills, AAA Corporate Bonds, Commercial Real Estate Equity) and generate client-side ZK proofs proving $\ge 150\%$ over-collateralization and accredited investor status.
- **Complete Balance-Sheet Shielding:** Public blockchain observers only see 32-byte cryptographic commitments, preventing identity leakage or financial snooping.
- **Midnight Rational Privacy (Auditor Viewing Keys):** Regulated entities can grant cryptographically verifiable time-locked viewing keys to regulators (SEC, FINRA, ESMA) for selective audit compliance without exposing data to the public.

---

## 2. Key Value Propositions
1. **Confidential RWA Collateralization:** Collateral amounts and specific asset holdings are committed as private witness data.
2. **Deterministic Anti-Double-Borrow Nullifiers:** A nullifier `Hash(borrowerSecret, loanId)` is stored on the public ledger to prevent double-spending without revealing the underlying private key.
3. **Accredited Investor Merkle KYC:** Proves whitelist inclusion without disclosing specific leaf identity.
4. **Programmable Selective Disclosure:** Enables regulatory compliance audits using localized encryption keys.
