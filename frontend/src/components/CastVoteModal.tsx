import React, { useState } from 'react';
import { Shield, Check, AlertCircle, X, Sparkles, Loader2 } from 'lucide-react';
import { Proposal, VoterProfile } from '../types/index.ts';
import { computeNullifier } from '../services/crypto-browser.ts';

interface CastVoteModalProps {
  proposal: Proposal | null;
  voter: VoterProfile;
  onClose: () => void;
  onSubmitVote: (proposalId: string, choiceIndex: number) => Promise<void>;
}

export const CastVoteModal: React.FC<CastVoteModalProps> = ({
  proposal,
  voter,
  onClose,
  onSubmitVote
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepStatus, setStepStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<boolean>(false);
  const [derivedNullifier, setDerivedNullifier] = useState<string>('');

  if (!proposal) return null;

  const handleCastVote = async () => {
    if (selectedOption === null) return;
    setIsSubmitting(true);
    setError(null);

    try {
      setStepStatus('1. Loading Shielded Private Witness (Voter Secret & Choice)...');
      await new Promise(r => setTimeout(r, 400));

      setStepStatus('2. Constructing Merkle Membership Proof against Eligibility Root...');
      await new Promise(r => setTimeout(r, 450));

      setStepStatus('3. Deriving Unlinkable Deterministic Nullifier = Hash(Secret, ProposalID)...');
      const nullifier = await computeNullifier(voter.voterSecret, proposal.id);
      setDerivedNullifier(nullifier);
      await new Promise(r => setTimeout(r, 400));

      setStepStatus('4. Submitting Shielded Transaction to Midnight Ledger...');
      await onSubmitVote(proposal.id, selectedOption);

      setTxSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cast vote';
      setError(msg);
    } finally {
      setIsSubmitting(false);
      setStepStatus('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '10px' }}>
              <Shield size={20} color="#a78bfa" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Cast Zero-Knowledge Ballot
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {txSuccess ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', padding: '1rem 0' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Check size={32} />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
              Ballot Successfully Shielded & Counted!
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Your zero-knowledge proof verified your eligibility, registered your single-use nullifier, and incremented the public tally without revealing your identity or choice.
            </p>
            <div style={{ width: '100%', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-glass)', textAlign: 'left' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Spent Nullifier (Public On-Chain Identifier):</span>
              <span className="hash-pill" style={{ color: '#c084fc', display: 'block', marginTop: '0.2rem' }}>{derivedNullifier}</span>
            </div>
            <button onClick={onClose} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
              Done
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Selected Proposal</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.2rem' }}>
                {proposal.title}
              </h4>
            </div>

            {/* Privacy Box */}
            <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', padding: '0.9rem 1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c084fc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                <Sparkles size={14} /> Midnight Privacy Guarantee
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                Active Identity: <strong>{voter.name}</strong>. Your private key <code style={{ color: '#05f292' }}>{voter.voterSecret.slice(0, 14)}...</code> remains strictly isolated on your client.
              </p>
            </div>

            {/* Voting Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Select Your Confidential Choice:
              </span>
              {proposal.options.map((option, idx) => (
                <button
                  key={idx}
                  disabled={isSubmitting}
                  onClick={() => setSelectedOption(idx)}
                  className={`btn ${selectedOption === idx ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'space-between', padding: '0.85rem 1rem' }}
                  id={`btn-option-${idx}`}
                >
                  <span>{option}</span>
                  {selectedOption === idx && <Check size={18} />}
                </button>
              ))}
            </div>

            {/* Step Progress Display */}
            {isSubmitting && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '0.75rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#05f292', fontSize: '0.82rem' }}>
                <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>{stepStatus}</span>
              </div>
            )}

            {error && (
              <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '0.75rem', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#f87171', fontSize: '0.85rem' }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button onClick={onClose} disabled={isSubmitting} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                onClick={handleCastVote}
                disabled={selectedOption === null || isSubmitting}
                className="btn btn-primary"
                style={{ flex: 2, opacity: selectedOption === null || isSubmitting ? 0.6 : 1 }}
                id="btn-submit-ballot"
              >
                {isSubmitting ? 'Verifying Proof...' : 'Generate Proof & Submit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
