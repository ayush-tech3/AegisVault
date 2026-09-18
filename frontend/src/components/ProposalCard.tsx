import React from 'react';
import { ShieldCheck, Vote, CheckCircle2 } from 'lucide-react';
import { Proposal, ProposalStatus, VoteTally } from '../types/index.ts';

interface ProposalCardProps {
  proposal: Proposal;
  tally?: VoteTally;
  onVoteClick: (proposal: Proposal) => void;
  onInspectClick: (proposal: Proposal) => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  tally,
  onVoteClick,
  onInspectClick
}) => {
  const isActive = proposal.status === ProposalStatus.Active;
  const totalVotes = tally?.totalTally || proposal.totalVotesCast || 0;

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className={`badge ${isActive ? 'badge-active' : 'badge-closed'}`}>
              {isActive ? '● Active Voting' : 'Finalized'}
            </span>
            <span className="badge badge-shielded">
              <ShieldCheck size={12} /> ZK Shielded Ballot
            </span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {proposal.title}
          </h2>
        </div>
      </div>

      {/* Description */}
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
        {proposal.description}
      </p>

      {/* Options & Live Shielded Tallies */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {proposal.options.map((option, idx) => {
          const count = tally?.optionVotes[idx] || 0;
          const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

          return (
            <div
              key={idx}
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-glass)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${percentage}%`,
                  background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.25))',
                  transition: 'width 0.4s ease',
                  zIndex: 0
                }}
              />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  {option}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8' }}>
                  {count} votes ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meta & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ZK Eligibility Merkle Root
          </span>
          <span className="hash-pill" style={{ fontSize: '0.75rem' }}>
            {proposal.eligibilityRoot.slice(0, 18)}...{proposal.eligibilityRoot.slice(-10)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => onInspectClick(proposal)}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}
            id={`btn-inspect-${proposal.id.slice(0, 8)}`}
          >
            <CheckCircle2 size={14} /> Privacy Matrix
          </button>
          
          {isActive && (
            <button
              onClick={() => onVoteClick(proposal)}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              id={`btn-vote-${proposal.id.slice(0, 8)}`}
            >
              <Vote size={15} /> Cast Secret Vote
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
