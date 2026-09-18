import React from 'react';
import { Shield, Lock, Wallet, UserCheck } from 'lucide-react';
import { VoterProfile } from '../types/index.ts';
import { SEED_VOTERS } from '../services/midnight-client.ts';

interface NavbarProps {
  currentVoter: VoterProfile;
  onSelectVoter: (voter: VoterProfile) => void;
  isLace: boolean;
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentVoter,
  onSelectVoter,
  isLace,
  onOpenCreateModal
}) => {
  return (
    <header className="glass-panel" style={{ margin: '1.25rem auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
        }}>
          <Shield size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            VeilVote
          </h1>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className="glow-indicator" /> Powered by Midnight Network ZK
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <button onClick={onOpenCreateModal} className="btn btn-primary" id="btn-create-proposal">
          + New Proposal
        </button>

        {/* Identity / Voter Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.4)', padding: '0.35rem 0.75rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
          <UserCheck size={16} color="#8b5cf6" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Voter Identity:</span>
          <select
            value={currentVoter.name}
            onChange={(e) => {
              const selected = SEED_VOTERS.find(v => v.name === e.target.value);
              if (selected) onSelectVoter(selected);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#38bdf8',
              fontFamily: 'var(--font-main)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
            id="select-voter-identity"
          >
            {SEED_VOTERS.map((v) => (
              <option key={v.name} value={v.name} style={{ background: '#10121d', color: '#fff' }}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Network & Wallet Status */}
        <div className="badge badge-shielded" style={{ padding: '0.5rem 0.85rem' }}>
          <Lock size={13} />
          <span>Midnight Testnet (Compact v0.19)</span>
        </div>

        <div className="badge badge-active" style={{ padding: '0.5rem 0.85rem' }}>
          <Wallet size={13} />
          <span>{isLace ? 'Lace Connected' : 'Local Prover Ready'}</span>
        </div>
      </div>
    </header>
  );
};
