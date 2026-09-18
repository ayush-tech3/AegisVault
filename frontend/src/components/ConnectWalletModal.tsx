import React, { useState } from 'react';
import { Shield, Sparkles, X, Compass, CheckCircle2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { SEED_VOTERS } from '../services/midnight-client.ts';
import { VoterProfile } from '../types/index.ts';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectFreighter: () => Promise<void>;
  onConnectDemo: (voter?: VoterProfile) => void;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
  onConnectFreighter,
  onConnectDemo
}) => {
  const [isConnectingFreighter, setIsConnectingFreighter] = useState(false);
  const [freighterNotice, setFreighterNotice] = useState<string | null>(null);
  const [selectedDemoVoter, setSelectedDemoVoter] = useState<VoterProfile>(SEED_VOTERS[0]);

  if (!isOpen) return null;

  const handleFreighter = async () => {
    setIsConnectingFreighter(true);
    setFreighterNotice(null);
    try {
      await onConnectFreighter();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not connect to Freighter wallet';
      setFreighterNotice(msg);
    } finally {
      setIsConnectingFreighter(false);
    }
  };

  const handleDemo = () => {
    onConnectDemo(selectedDemoVoter);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '2rem', maxWidth: '580px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '10px' }}>
              <Shield size={22} color="#a78bfa" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
                Select Wallet Provider
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Choose a wallet to authenticate zero-knowledge voting operations
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            id="btn-close-wallet-modal"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {freighterNotice && (
          <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '0.85rem' }}>
            <AlertCircle size={16} />
            <span>{freighterNotice}</span>
          </div>
        )}

        {/* Options Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          
          {/* Option 1: Freighter Wallet */}
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(22, 26, 42, 0.7))',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #0891b2, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Compass size={22} color="#fff" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f8fafc' }}>Freighter Wallet</span>
                    <span className="badge badge-active" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>Web3 Extension</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Connect via Freighter browser extension with secret key derivation
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFreighter}
              disabled={isConnectingFreighter}
              className="btn btn-cyan"
              style={{ width: '100%', padding: '0.7rem 1rem', marginTop: '0.25rem' }}
              id="btn-connect-freighter-opt"
            >
              {isConnectingFreighter ? (
                <>
                  <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Connecting Freighter...
                </>
              ) : (
                <>
                  Connect Freighter Wallet <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* Option 2: Demo Wallet */}
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(22, 26, 42, 0.7))',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={22} color="#fff" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f8fafc' }}>Demo Shielded Wallet</span>
                    <span className="badge badge-shielded" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>ZK Prover</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Instant zero-knowledge test identities (No extension needed)
                  </span>
                </div>
              </div>
            </div>

            {/* Seed Voter Selector for Demo */}
            <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Choose Pre-authorized Test Persona:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {SEED_VOTERS.map((voter) => (
                  <button
                    key={voter.name}
                    type="button"
                    onClick={() => setSelectedDemoVoter(voter)}
                    style={{
                      background: selectedDemoVoter.name === voter.name ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255,255,255,0.03)',
                      border: selectedDemoVoter.name === voter.name ? '1px solid #8b5cf6' : '1px solid var(--border-glass)',
                      color: selectedDemoVoter.name === voter.name ? '#c4b5fd' : 'var(--text-secondary)',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{voter.name.split(' ')[0]}</span>
                    {selectedDemoVoter.name === voter.name && <CheckCircle2 size={13} color="#8b5cf6" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemo}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.7rem 1rem' }}
              id="btn-connect-demo-opt"
            >
              Connect as {selectedDemoVoter.name.split(' ')[0]} <ArrowRight size={16} />
            </button>
          </div>

        </div>

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            🔒 All wallet secrets remain isolated client-side for zero-knowledge witness generation.
          </span>
        </div>
      </div>
    </div>
  );
};
