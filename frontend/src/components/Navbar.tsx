import { Shield, Lock, Wallet, UserCheck, Key, Plus, LogOut, Power, Compass } from 'lucide-react';
import { VoterProfile } from '../types/index.ts';
import { SEED_VOTERS, midnightClient, WalletProviderType } from '../services/midnight-client.ts';

interface NavbarProps {
  currentVoter: VoterProfile;
  isConnected: boolean;
  walletType: WalletProviderType;
  onSelectVoter: (voter: VoterProfile) => void;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onOpenCreateModal: () => void;
  onVoterUpdated: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentVoter,
  isConnected,
  walletType,
  onSelectVoter,
  onConnectWallet,
  onDisconnectWallet,
  onOpenCreateModal,
  onVoterUpdated
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customSecret, setCustomSecret] = useState('');

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customSecret) return;
    await midnightClient.importCustomVoter(customName, customSecret);
    setShowImportModal(false);
    setCustomName('');
    setCustomSecret('');
    onVoterUpdated();
  };

  return (
    <>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button onClick={onOpenCreateModal} className="btn btn-primary" id="btn-create-proposal">
            + New Proposal
          </button>

          {/* Identity / Voter Switcher */}
          {isConnected && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.4)', padding: '0.35rem 0.65rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <UserCheck size={16} color="#8b5cf6" />
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
                  outline: 'none',
                  maxWidth: '170px'
                }}
                id="select-voter-identity"
              >
                {SEED_VOTERS.map((v) => (
                  <option key={v.name} value={v.name} style={{ background: '#10121d', color: '#fff' }}>
                    {v.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowKeyModal(true)}
                title="View Shielded Credentials"
                style={{ background: 'transparent', border: 'none', color: '#a78bfa', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem' }}
              >
                <Key size={14} />
              </button>

              <button
                onClick={() => setShowImportModal(true)}
                title="Import Custom Voter Key"
                style={{ background: 'transparent', border: 'none', color: '#06b6d4', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem' }}
              >
                <Plus size={14} />
              </button>
            </div>
          )}

          {/* Network Badge */}
          <div className="badge badge-shielded" style={{ padding: '0.5rem 0.85rem' }}>
            <Lock size={13} />
            <span>Midnight Testnet (Compact v0.19)</span>
          </div>

          {/* Wallet Connect/Disconnect */}
          {isConnected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                className={`badge ${walletType === 'freighter' ? 'badge-active' : 'badge-shielded'}`}
                style={{
                  padding: '0.5rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  border: walletType === 'freighter' ? '1px solid rgba(6, 182, 212, 0.4)' : undefined
                }}
              >
                {walletType === 'freighter' ? (
                  <>
                    <Compass size={14} color="#06b6d4" />
                    <span style={{ color: '#67e8f9' }}>Freighter ({currentVoter.address.slice(0, 4)}...{currentVoter.address.slice(-4)})</span>
                  </>
                ) : (
                  <>
                    <Wallet size={14} />
                    <span>{currentVoter.name.split(' ')[0]} (Prover)</span>
                  </>
                )}
              </div>
              <button
                onClick={onDisconnectWallet}
                title="Disconnect Wallet"
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
                id="btn-disconnect-wallet"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onConnectWallet}
              className="btn btn-cyan"
              style={{ padding: '0.5rem 1rem' }}
              id="btn-connect-wallet"
            >
              <Power size={14} /> Connect Wallet
            </button>
          )}
        </div>
      </header>

      {/* Shielded Key Inspector Modal */}
      {showKeyModal && (
        <div className="modal-overlay" onClick={() => setShowKeyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={18} color="#c084fc" /> Shielded Voter Credentials
              </h3>
              <button onClick={() => setShowKeyModal(false)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                Close
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              These private keys generate zero-knowledge proofs on the client side. They are never transmitted across the network or stored in public ledger state.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Voter Identity</span>
                <div style={{ fontWeight: 600, color: '#f8fafc' }}>{currentVoter.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Midnight Wallet Address</span>
                <div className="hash-pill">{currentVoter.address}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 600 }}>Private Voter Secret (Shielded Client Witness)</span>
                <div className="hash-pill" style={{ color: '#f472b6' }}>{currentVoter.voterSecret}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Public Commitment = Hash(voterSecret)</span>
                <div className="hash-pill" style={{ color: '#34d399' }}>{currentVoter.voterCommitment || 'Calculated on-demand'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Custom Key Modal */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
              Import Custom Voter Credentials
            </h3>
            <form onSubmit={handleImport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  Voter Profile Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stake Pool Operator #9"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  Private Secret Key (Hex / Passphrase)
                </label>
                <input
                  type="text"
                  placeholder="e.g. secret_custom_key_0x9923..."
                  value={customSecret}
                  onChange={(e) => setCustomSecret(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowImportModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Import & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
