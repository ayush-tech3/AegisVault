# AegisVault: Formal Zero-Knowledge Privacy Model & Threat Analysis
**Platform:** Midnight Network (Compact Language v0.19)  
**Security Standard:** BLS12-381 PLONK zk-SNARK

---

## 1. Adversarial Threat Model

### Adversary Capabilities
1. **Public Blockchain Observers & Indexers:** Can view all transactions, public maps (`collateralCommitments`, `activeLoans`, `spentNullifiers`), and block timestamps.
2. **Malicious Borrowers (Sybil / Double-Borrow Attackers):** Attempt to borrow multiple loans against a single collateral deposit, or borrow without meeting the 150% over-collateralization threshold.
3. **Unaccredited Borrowers:** Attempt to access institutional liquidity pools without passing KYC/AML verification.
4. **Curious Third Parties:** Attempt to deduce an institution's financial health, treasury size, or specific RWA asset types from public transaction patterns.

---

## 2. Security & Privacy Invariants

### Invariant 1: Zero Knowledge of Collateral Value & Breakdown
* **Mechanism:** The collateral deposit produces a Pedersen/Poseidon commitment:
  $$C = \text{Hash}(K_{\text{secret}} \parallel \text{salt} \parallel \text{Value}_{\text{USD}} \parallel \text{AssetType})$$
* **Security:** The commitment is computationally hiding and binding under the discrete logarithm assumption on BLS12-381. An observer learns zero information about $\text{Value}_{\text{USD}}$ or $\text{AssetType}$.

### Invariant 2: Mathematical Enforceability of Over-Collateralization (≥150%)
* **Mechanism:** In the client prover, the circuit evaluates:
  $$\text{assert } (\text{Value}_{\text{USD}} \times 10,000 \ge \text{Principal}_{\text{USD}} \times 15,000)$$
* **Security:** If the borrower inputs an under-collateralized value, the arithmetic circuit cannot be satisfied, and no valid PLONK proof can be produced.

### Invariant 3: Deterministic Nullifiers for Anti-Double-Borrow Protection
* **Mechanism:** Every borrow circuit emits a deterministic nullifier:
  $$\text{Nullifier} = \text{Hash}(K_{\text{secret}} \parallel \text{LoanId})$$
* **Security:** The contract asserts $\text{Nullifier} \notin \text{spentNullifiers}$. Once inserted, any subsequent attempt using the same secret key and loan reference will revert immediately on-chain.

### Invariant 4: Programmable Selective Compliance via Viewing Keys
* **Mechanism:** When required by regulatory compliance, the borrower signs an encrypted payload containing the collateral audit attestation encrypted under the regulator's public key $PK_{\text{auditor}}$:
  $$\text{Ciphertext} = \text{Encrypt}_{PK_{\text{auditor}}}(\text{AuditPayload}, K_{\text{view}})$$
* **Security:** Only the designated regulatory entity holding $SK_{\text{auditor}}$ can decrypt the audit payload. The public ledger and other market participants remain completely oblivious.
