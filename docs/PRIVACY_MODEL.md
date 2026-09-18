# Privacy Model Analysis: What an Observer Can and Cannot Learn

The core architectural differentiator of Midnight is its **dual-state paradigm**, segregating public ledger state from client-side private witness state. VeilVote applies this model to secret-ballot governance.

---

## 1. Summary Matrix

| Data Element | Visible to Public Observer? | Kept in Shielded Client Witness? | Protection Mechanism |
| :--- | :---: | :---: | :--- |
| **Voter Wallet Address** | ❌ NO | ✅ YES | Merkle tree membership proof |
| **Voter Secret Key** | ❌ NO | ✅ YES | Client-side memory isolation |
| **Individual Ballot Choice** | ❌ NO | ✅ YES | Unlinkable zk-SNARK transition |
| **Merkle Path / Leaf Index** | ❌ NO | ✅ YES | Shielded circuit inputs |
| **Spent Nullifier** | ✅ YES | ❌ NO | Deterministic hash `Hash(Secret, ProposalID)` |
| **Aggregated Vote Tally** | ✅ YES | ❌ NO | Public ledger state accumulator |
| **Proposal Metadata & Deadline**| ✅ YES | ❌ NO | Public ledger contract state |

---

## 2. What an Observer CAN Learn
1. **Total Number of Votes Cast:** An observer can see the total number of valid votes recorded for a proposal.
2. **Current Aggregated Results:** The cumulative votes for each option (e.g. Option A: 12, Option B: 5) are public and verifiable.
3. **Nullifier Registration:** An observer can see a list of 32-byte pseudo-random nullifiers that have been spent.
4. **Proposal Invariants:** Observers can audit the eligibility root, creation timestamp, and proposal status.

---

## 3. What an Observer CANNOT Learn
1. **Voter Identity / Key:** An observer cannot associate a transaction or nullifier with any specific voter, wallet address, or identity.
2. **Individual Choices:** Even if an observer knows an individual participated in the vote, they cannot determine whether that individual voted Option A, Option B, or Abstain.
3. **Linkability Across Proposals:** Nullifiers are salted with the unique `proposalId`. Therefore, an observer cannot correlate a voter's nullifier across different proposals to build a voting profile.
4. **Coercion Resistance:** Because voters cannot cryptographically prove to a third party *after the fact* which option they selected (without revealing their underlying secret key), bribery and vote-buying incentives are eliminated.
