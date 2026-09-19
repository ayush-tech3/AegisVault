import React, { useState } from 'react';
import { Shield, EyeOff, Eye, CheckCircle2, Lock, Key, Binary, Network, RefreshCw, Cpu, Layers } from 'lucide-react';
import { Proposal, VoteTally, VoterProfile } from '../types/index.ts';
import { SEED_VOTERS } from '../services/midnight-client.ts';

interface PrivacyExplorerPageProps {
  proposals: Proposal[];
  tallies: Map<string, VoteTally>;
  currentVoter: VoterProfile;
  nullifiers: string[];
}

export const PrivacyExplorerPage: React.FC<PrivacyExplorerPageProps> = ({
  proposals,
  tallies,
  currentVoter,
  nullifiers
}) => {
  const [selectedPropId, setSelectedPropId] = useState<string>(proposals[0]?.id || '');
  const activeProposal = proposals.find(p => p.id === selectedPropId) || proposals[0];
  const activeTally = activeProposal ? tallies.get(activeProposal.id) : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(16, 185, 129, 0.08))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-shielded">
            <Shield size={13} /> Midnight Dual-State Architecture
          </span>
          <span className="badge badge-active">
            <Cpu size={13} /> Compact v0.19 Circuit Prover
          </span>
        </div>
        <h2 className="hero-banner-title" style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
          Zero-Knowledge Privacy & Merkle Inspector
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '850px', fontSize: '1rem', lineHeight: 1.6 }}>
          Inspect how Midnight cryptographically isolates sensitive voter credentials and individual ballot selections client-side, while committing only verifiable nullifiers and Merkle proofs to the public blockchain ledger.
        </p>
      </div>

      {/* Dual State Comparison Box */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: '1.5rem' }}>
        
        {/* Shielded State */}
        <div
          className="glass-panel glass-panel-purple"
          style={{
            padding: '1.75rem',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.08), rgba(14, 16, 23, 0.85))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '10px' }}>
              <EyeOff size={22} color="#c084fc" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                Private / Shielded Witness (Client-Only)
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#c084fc' }}>
                Never transmitted across network or stored on blockchain
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.9rem', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Identity Secret Key</span>
                <span className="badge badge-shielded" style={{ fontSize: '0.65rem' }}>Shielded</span>
              </div>
              <span className="hash-pill" style={{ color: '#f472b6', display: 'block' }}>
                {currentVoter.voterSecret}
              </span>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.9rem', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Voter Choice Index</span>
                <span className="badge badge-shielded" style={{ fontSize: '0.65rem' }}>Confidential</span>
              </div>
              <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 600 }}>
                ZK-Encapsulated in proof payload
              </span>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.9rem', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Merkle Membership Path</span>
                <span className="badge badge-shielded" style={{ fontSize: '0.65rem' }}>Private Witness</span>
              </div>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                Cryptographic authentication path verifying index #{currentVoter.indexInAllowlist} in allowlist root
              </span>
            </div>
          </div>
        </div>

        {/* Public Ledger State */}
        <div
          className="glass-panel"
          style={{
            padding: '1.75rem',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08), rgba(14, 16, 23, 0.85))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
              <Eye size={22} color="#05f292" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                Public Ledger State (Transparent)
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald-bright)' }}>
                Verifiable by all nodes, indexers & validators
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.9rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Eligibility Merkle Root</span>
                <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>Verified</span>
              </div>
              <span className="hash-pill" style={{ display: 'block' }}>
                {activeProposal?.eligibilityRoot || '0x8f204891b0923847102938471029384710293847102938471029384710293847'}
              </span>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.9rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aggregated Public Tally</span>
                <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>Public Count</span>
              </div>
              <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 700 }}>
                Total Ballots Recorded: {activeTally?.totalTally || 0}
              </span>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.9rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Spent Nullifier Count</span>
                <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>On-Chain</span>
              </div>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                {nullifiers.length} single-use nullifiers registered (Double voting mathematically impossible)
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Merkle Tree Allowlist Visualizer */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.18)', borderRadius: '10px' }}>
              <Network size={20} color="#fbbf24" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                Merkle Allowlist Tree & Leaf Commitments
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Leaves are Public Commitments = Hash(VoterSecret). Tree root governs proposal eligibility.
              </span>
            </div>
          </div>
          <div className="badge badge-amber">
            Root: {activeProposal?.eligibilityRoot?.slice(0, 14)}...
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1rem' }}>
          {SEED_VOTERS.map((voter, idx) => (
            <div
              key={voter.name}
              style={{
                background: currentVoter.name === voter.name ? 'rgba(16, 185, 129, 0.12)' : 'rgba(0,0,0,0.35)',
                border: currentVoter.name === voter.name ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-glass)',
                padding: '1rem',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
                  Leaf #{idx}: {voter.name.split(' ')[0]}
                </span>
                {currentVoter.name === voter.name && (
                  <span className="badge badge-active" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                    Active
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Voter Commitment:</span>
              <span className="hash-pill" style={{ fontSize: '0.75rem' }}>
                {voter.voterCommitment ? voter.voterCommitment.slice(0, 22) + '...' : '0x8a92...e109'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Spent Nullifiers Registry Table */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div style={{ padding: '0.5rem', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '10px' }}>
            <Binary size={20} color="#c084fc" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              Live On-Chain Nullifier Registry
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Deterministic single-use tokens = Hash(voterSecret, proposalId). Prevents double-voting without linking identity.
            </span>
          </div>
        </div>

        {nullifiers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
            No nullifiers spent yet. Cast a vote to register an on-chain nullifier!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {nullifiers.map((nullifier, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="badge badge-shielded" style={{ fontSize: '0.7rem' }}>
                    Nullifier #{idx + 1}
                  </span>
                  <span className="hash-pill">{nullifier}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald-bright)', fontWeight: 600 }}>
                  Spent & Validated ✅
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
