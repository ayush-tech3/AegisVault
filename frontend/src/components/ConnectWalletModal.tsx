import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, X, Compass, CheckCircle2, ArrowRight, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { SEED_VOTERS, midnightClient } from '../services/midnight-client.ts';
import { VoterProfile } from '../types/index.ts';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectFreighter: (fallbackToMock?: boolean) => Promise<void>;
  onConnectDemo: (voter?: VoterProfile) => void;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
  onConnectFreighter,
  onConnectDemo
}) => {
  const [isConnectingFreighter, setIsConnectingFreighter] = useState(false);
  const [hasExtension, setHasExtension] = useState<boolean | null>(null);
  const [freighterNotice, setFreighterNotice] = useState<string | null>(null);
  const [selectedDemoVoter, setSelectedDemoVoter] = useState<VoterProfile>(SEED_VOTERS[0]);

  useEffect(() => {
    if (isOpen) {
      midnightClient.isFreighterAvailable().then(avail => {
        setHasExtension(avail);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRealFreighter = async () => {
    setIsConnectingFreighter(true);
    setFreighterNotice(null);
    try {
      await onConnectFreighter(false);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not connect to Freighter wallet';
      setFreighterNotice(msg);
    } finally {
      setIsConnectingFreighter(false);
    }
  };

  const handleFallbackFreighter = async () => {
    setIsConnectingFreighter(true);
    setFreighterNotice(null);
    try {
      await onConnectFreighter(true);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to initialize test key';
      setFreighterNotice(msg);
    } finally {
      setIsConnectingFreighter(false);
    }
  };

  const handleDemo = () => {
    onConnectDemo(selectedDemoVoter);
    onClose();
  };

  // Filter seed voters to only canonical 4 demo delegates
  const demoPersonas = SEED_VOTERS.filter(v => !v.address.startsWith('GCFX') && !v.name.startsWith('Freighter')).slice(0, 4);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '1.75rem', maxWidth: '580px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '10px' }}>
              <Shield size={22} color="#a78bfa" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                Select Wallet Provider
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Connect your real browser extension or launch with a local prover
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
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: '#f87171', fontSize: '0.85rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div>{freighterNotice}</div>
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a
                  href="https://www.freighter.app/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#38bdf8', fontSize: '0.8rem', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  Download Freighter Extension <ExternalLink size={12} />
                </a>
                <button
                  type="button"
                  onClick={handleFallbackFreighter}
                  style={{ background: 'transparent', border: 'none', color: '#a78bfa', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                >
                  Use Simulated Test Account instead
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Options Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Option 1: Real Freighter Wallet */}
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(22, 26, 42, 0.7))',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #0891b2, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Compass size={24} color="#fff" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f8fafc' }}>Freighter Wallet</span>
                    {hasExtension ? (
                      <span className="badge badge-active" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                        Extension Ready ✅
                      </span>
                    ) : (
                      <span className="badge badge-shielded" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                        Web3 Extension
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Connects directly to real Freighter browser popup & retrieves your public key
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRealFreighter}
              disabled={isConnectingFreighter}
              className="btn btn-cyan"
              style={{ width: '100%', padding: '0.75rem 1rem' }}
              id="btn-connect-freighter-opt"
            >
              {isConnectingFreighter ? (
                <>
                  <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Waiting for Freighter popup approval...
                </>
              ) : (
                <>
                  Connect Real Freighter Extension <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* Option 2: Demo Wallet */}
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(22, 26, 42, 0.7))',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={24} color="#fff" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f8fafc' }}>Demo Shielded Wallet</span>
                    <span className="badge badge-shielded" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>Local Prover</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Instant zero-knowledge identities (Alice, Bob, Carol, Dave)
                  </span>
                </div>
              </div>
            </div>

            {/* Seed Persona Grid */}
            <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Select Test Delegate:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {demoPersonas.map((voter) => (
                  <button
                    key={voter.name}
                    type="button"
                    onClick={() => setSelectedDemoVoter(voter)}
                    style={{
                      background: selectedDemoVoter.name === voter.name ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255,255,255,0.03)',
                      border: selectedDemoVoter.name === voter.name ? '1px solid #8b5cf6' : '1px solid var(--border-glass)',
                      color: selectedDemoVoter.name === voter.name ? '#c4b5fd' : 'var(--text-secondary)',
                      padding: '0.45rem 0.6rem',
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
              style={{ width: '100%', padding: '0.75rem 1rem' }}
              id="btn-connect-demo-opt"
            >
              Launch Demo as {selectedDemoVoter.name.split(' ')[0]} <ArrowRight size={16} />
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
