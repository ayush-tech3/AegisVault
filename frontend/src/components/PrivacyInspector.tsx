import React from 'react';
import { Eye, EyeOff, ShieldCheck, Database, Key, CheckCircle, XCircle } from 'lucide-react';
import { Proposal, VoteTally, VoterProfile } from '../types/index.ts';

interface PrivacyInspectorProps {
  proposal: Proposal;
  tally?: VoteTally;
  currentVoter: VoterProfile;
  nullifiers: string[];
  onClose: () => void;
}

export const PrivacyInspector: React.FC<PrivacyInspectorProps> = ({
  proposal,
  tally,
  currentVoter,
  nullifiers,
  onClose
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px', padding: '1.5rem', width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={22} color="#8b5cf6" /> Midnight Privacy Matrix & Observer Inspector
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Target: {proposal.title}
            </span>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            Close
          </button>
        </div>

        {/* Dual-State Visualizer Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Public Ledger State (What an Observer CAN see) */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 700, fontSize: '0.95rem' }}>
              <Eye size={18} />
              <Database size={16} />
              <span>Public Blockchain Ledger State</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Visible to any observer, indexer, or validator on the network:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Proposal ID:</span>
                <span className="hash-pill">{proposal.id.slice(0, 14)}...</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Eligibility Root:</span>
                <span className="hash-pill">{proposal.eligibilityRoot.slice(0, 14)}...</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Aggregate Tallies:</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>{JSON.stringify(tally?.optionVotes || [])}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Spent Nullifiers ({nullifiers.length}):</span>
                <span style={{ color: '#a78bfa' }}>Registered</span>
              </div>
            </div>

            <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.65rem', borderRadius: '8px', maxHeight: '90px', overflowY: 'auto' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>On-Chain Nullifiers:</span>
              {nullifiers.length === 0 ? (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No votes cast yet</span>
              ) : (
                nullifiers.map((n, i) => (
                  <div key={i} className="hash-pill" style={{ fontSize: '0.7rem', marginBottom: '0.2rem' }}>{n}</div>
                ))
              )}
            </div>
          </div>

          {/* Private Witness State (What an Observer CANNOT see) */}
          <div style={{ background: 'rgba(30, 20, 50, 0.7)', borderRadius: '14px', border: '1px solid rgba(168, 85, 247, 0.35)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontWeight: 700, fontSize: '0.95rem' }}>
              <EyeOff size={18} />
              <Key size={16} />
              <span>Shielded Private Witness (Client Prover)</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Kept strictly confidential in local memory during proof generation:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Voter Private Secret:</span>
                <span className="hash-pill" style={{ color: '#f43f5e' }}>HIDDEN (Local Only)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Individual Ballot Choice:</span>
                <span className="hash-pill" style={{ color: '#f43f5e' }}>SHIELDED (Local Only)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Merkle Auth Path:</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Proven via zk-SNARK</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Active Identity Profile:</span>
                <span style={{ color: '#38bdf8' }}>{currentVoter.name}</span>
              </div>
            </div>

            <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.65rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#c4b5fd', display: 'block', marginBottom: '0.2rem' }}>Local Secret Key:</span>
              <span className="hash-pill" style={{ fontSize: '0.75rem', color: '#f472b6' }}>{currentVoter.voterSecret}</span>
            </div>
          </div>
        </div>

        {/* Privacy Matrix Table */}
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border-glass)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Midnight Information Leakage Analysis
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', minWidth: '540px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.5rem' }}>Data Element</th>
                <th style={{ padding: '0.5rem' }}>Observer Visibility</th>
                <th style={{ padding: '0.5rem' }}>Cryptographic Protection</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>Voter Identity / Wallet Address</td>
                <td style={{ padding: '0.5rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><XCircle size={14} /> Never Revealed</td>
                <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>Shielded by ZK Merkle membership proof</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>Individual Ballot Choice (Yes/No)</td>
                <td style={{ padding: '0.5rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><XCircle size={14} /> Never Revealed</td>
                <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>Unlinkable nullifier + private witness state</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>Double-Voting Prevention</td>
                <td style={{ padding: '0.5rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle size={14} /> Publicly Enforced</td>
                <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>Nullifier = Hash(Secret, ProposalID) uniqueness check</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>Proposal Status & Total Tallies</td>
                <td style={{ padding: '0.5rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle size={14} /> Publicly Verifiable</td>
                <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>Compact smart contract public ledger accumulator</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
