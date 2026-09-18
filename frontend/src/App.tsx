import { useState, useEffect } from 'react';
import { Navbar, AppPageTab } from './components/Navbar.tsx';
import { ProposalCard } from './components/ProposalCard.tsx';
import { CastVoteModal } from './components/CastVoteModal.tsx';
import { CreateProposalModal } from './components/CreateProposalModal.tsx';
import { ConnectWalletModal } from './components/ConnectWalletModal.tsx';
import { PrivacyInspector } from './components/PrivacyInspector.tsx';
import { PrivacyExplorerPage } from './components/PrivacyExplorerPage.tsx';
import { LedgerAuditPage } from './components/LedgerAuditPage.tsx';
import { midnightClient, SEED_VOTERS, WalletProviderType } from './services/midnight-client.ts';
import { Proposal, VoteTally, VoterProfile, LedgerLog } from './types/index.ts';
import { Shield, Sparkles, Activity, Cpu, AlertCircle, RefreshCw, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

export function App() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [tallies, setTallies] = useState<Map<string, VoteTally>>(new Map());
  const [logs, setLogs] = useState<LedgerLog[]>([]);
  const [nullifiers, setNullifiers] = useState<string[]>([]);
  const [currentVoter, setCurrentVoter] = useState<VoterProfile>(SEED_VOTERS[0]);
  const [isConnected, setIsConnected] = useState(false);
  const [walletType, setWalletType] = useState<WalletProviderType>('disconnected');
  const [activeTab, setActiveTab] = useState<AppPageTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'privacy' || hash === 'audit' || hash === 'proposals') return hash as AppPageTab;
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'privacy' || tabParam === 'audit' || tabParam === 'proposals') return tabParam as AppPageTab;
    }
    return 'proposals';
  });
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Modals state
  const [votingProposal, setVotingProposal] = useState<Proposal | null>(null);
  const [inspectingProposal, setInspectingProposal] = useState<Proposal | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      await midnightClient.init();
      refreshData();
      setIsLoading(false);
    }
    loadData();
  }, []);

  const refreshData = () => {
    const loadedProposals = midnightClient.getProposals();
    setProposals([...loadedProposals]);

    const newTallies = new Map<string, VoteTally>();
    loadedProposals.forEach(p => {
      const t = midnightClient.getTally(p.id);
      if (t) newTallies.set(p.id, t);
    });
    setTallies(newTallies);

    setLogs(midnightClient.getLogs());
    setNullifiers(midnightClient.getNullifiers());
    setCurrentVoter(midnightClient.getConnectedVoter());
    setIsConnected(midnightClient.isWalletConnected());
    setWalletType(midnightClient.getWalletType());
  };

  const handleSelectVoter = (voter: VoterProfile) => {
    midnightClient.setConnectedVoter(voter);
    setCurrentVoter(voter);
    showToast(`Switched active voter identity to ${voter.name}`);
  };

  const handleConnectFreighter = async (fallbackToMock?: boolean) => {
    const voter = await midnightClient.connectFreighter(fallbackToMock);
    refreshData();
    showToast(`Freighter Wallet Connected (${voter.address.slice(0, 4)}...${voter.address.slice(-4)})`);
  };

  const handleConnectDemo = (voter?: VoterProfile) => {
    const target = midnightClient.connectDemo(voter);
    refreshData();
    showToast(`Demo Prover Connected as ${target.name}`);
  };

  const handleDisconnectWallet = () => {
    midnightClient.disconnect();
    refreshData();
    showToast('Wallet disconnected. Click "Connect Wallet" to reconnect.');
  };

  const handleOpenCreateModal = () => {
    if (!isConnected) {
      showToast('Please connect your wallet first to create a proposal.');
      setIsWalletModalOpen(true);
      return;
    }
    setIsCreateOpen(true);
  };

  const handleOpenVoteModal = (proposal: Proposal) => {
    if (!isConnected) {
      showToast('Please connect your wallet first to cast a shielded vote.');
      setIsWalletModalOpen(true);
      return;
    }
    setVotingProposal(proposal);
  };

  const handleCastVote = async (proposalId: string, choiceIndex: number) => {
    await midnightClient.castVote(proposalId, choiceIndex);
    refreshData();
    showToast('Confidential vote cast & nullifier registered on ledger!');
  };

  const handleCreateProposal = async (title: string, description: string, options: string[]) => {
    await midnightClient.createProposal(title, description, options);
    refreshData();
    showToast(`Proposal "${title}" published on Midnight ledger!`);
  };

  const showToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  return (
    <>
      {/* 3D Dynamic Ambient Canvas */}
      <div className="background-3d-wrapper">
        <div className="grid-plane-3d" />
        <div className="orb-3d orb-1" />
        <div className="orb-3d orb-2" />
        <div className="orb-3d orb-3" />
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Toast Feedback Notification */}
        {feedbackMessage && (
          <div style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            background: 'linear-gradient(135deg, rgba(14, 16, 23, 0.95), rgba(4, 31, 20, 0.95))',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#f8fafc',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(16, 185, 129, 0.2)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            <Sparkles size={16} color="#05f292" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Navigation */}
        <Navbar
          currentVoter={currentVoter}
          isConnected={isConnected}
          walletType={walletType}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          onSelectVoter={handleSelectVoter}
          onConnectWallet={() => setIsWalletModalOpen(true)}
          onDisconnectWallet={handleDisconnectWallet}
          onOpenCreateModal={handleOpenCreateModal}
          onVoterUpdated={refreshData}
        />

        {!isConnected && (
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.85rem 1.25rem', borderRadius: '14px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fbbf24', fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              <span>Wallet disconnected. Connect Freighter extension or Demo Prover to cast secret votes or create proposals.</span>
            </div>
            <button onClick={() => setIsWalletModalOpen(true)} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }} id="btn-banner-connect">
              Connect Wallet
            </button>
          </div>
        )}

        {/* PAGE 1: GOVERNANCE BALLOTS */}
        {activeTab === 'proposals' && (
          <>
            {/* Hero Banner with 3D Depth */}
            <div className="glass-panel" style={{ padding: '2.75rem', margin: '1.25rem 0 2rem 0', position: 'relative', overflow: 'hidden', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '820px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-active" style={{ padding: '0.35rem 0.75rem' }}>
                    <Sparkles size={14} /> Zero-Knowledge Dual-State Engine
                  </span>
                  <span className="badge badge-shielded" style={{ padding: '0.35rem 0.75rem' }}>
                    <Cpu size={14} /> Compact Smart Contract v0.19
                  </span>
                </div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '1rem', background: 'linear-gradient(135deg, #ffffff 30%, #a7f3d0 70%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Confidential Governance & Secret Ballots on Midnight
                </h1>

                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                  VeilVote utilizes Midnight’s dual-state zero-knowledge paradigm to guarantee mathematically confidential votes. Observers and blockchain indexers verify proof correctness, voter eligibility, and single-use nullifiers without ever learning who voted for which outcome.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setActiveTab('privacy')}
                    className="btn btn-primary"
                    id="btn-hero-inspect"
                  >
                    <Shield size={16} /> Open ZK Privacy Explorer
                  </button>
                  <button
                    onClick={handleOpenCreateModal}
                    className="btn btn-purple"
                    id="btn-hero-create"
                  >
                    + Create New Ballot
                  </button>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className="btn btn-secondary"
                  >
                    <Activity size={16} color="#fbbf24" /> Live Ledger Feed
                  </button>
                </div>
              </div>
            </div>

            {/* Proposals Section */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
                    Active Governance Proposals
                  </h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Cast your secret ballot using client-side zero-knowledge witness generation
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button onClick={refreshData} className="btn btn-secondary" style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem' }} title="Refresh Ledger State">
                    <RefreshCw size={14} />
                  </button>
                  <span className="badge badge-active">
                    {proposals.length} Proposals Live
                  </span>
                </div>
              </div>

              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  Loading Midnight ledger state...
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem' }}>
                  {proposals.map((prop) => (
                    <ProposalCard
                      key={prop.id}
                      proposal={prop}
                      tally={tallies.get(prop.id)}
                      currentVoter={currentVoter}
                      isConnected={isConnected}
                      onVoteClick={(p) => {
                        if (!isConnected) {
                          showToast('Please connect your wallet first to cast a vote.');
                          setIsWalletModalOpen(true);
                          return;
                        }
                        setVotingProposal(p);
                      }}
                      onInspectClick={(p) => setInspectingProposal(p)}
                      onProposalFinalized={refreshData}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Explore Banner Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
              <div
                className="glass-panel"
                style={{ padding: '1.5rem', cursor: 'pointer', border: '1px solid rgba(168, 85, 247, 0.25)' }}
                onClick={() => setActiveTab('privacy')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#c084fc' }}>
                    🛡️ ZK Privacy & Merkle Inspector
                  </span>
                  <ArrowRight size={18} color="#c084fc" />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Inspect private witness states, Merkle allowlist leaves, and on-chain nullifier registries in real-time.
                </p>
              </div>

              <div
                className="glass-panel"
                style={{ padding: '1.5rem', cursor: 'pointer', border: '1px solid rgba(245, 158, 11, 0.25)' }}
                onClick={() => setActiveTab('audit')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fbbf24' }}>
                    📊 Public Ledger & Level 3 Audit
                  </span>
                  <ArrowRight size={18} color="#fbbf24" />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  View live on-chain event telemetry, Compact v0.19 circuit specifications, and Rise In compliance matrix.
                </p>
              </div>
            </div>
          </>
        )}

        {/* PAGE 2: PRIVACY & ZK EXPLORER */}
        {activeTab === 'privacy' && (
          <PrivacyExplorerPage
            proposals={proposals}
            tallies={tallies}
            currentVoter={currentVoter}
            nullifiers={nullifiers}
          />
        )}

        {/* PAGE 3: PUBLIC LEDGER & AUDIT */}
        {activeTab === 'audit' && (
          <LedgerAuditPage
            logs={logs}
            onRefresh={refreshData}
          />
        )}

        {/* Modals */}
        <ConnectWalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
          onConnectFreighter={handleConnectFreighter}
          onConnectDemo={handleConnectDemo}
        />

        <CastVoteModal
          proposal={votingProposal}
          voter={currentVoter}
          onClose={() => setVotingProposal(null)}
          onSubmitVote={handleCastVote}
        />

        {isCreateOpen && (
          <CreateProposalModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSubmit={handleCreateProposal}
          />
        )}

        {inspectingProposal && (
          <PrivacyInspector
            proposal={inspectingProposal}
            tally={tallies.get(inspectingProposal.id)}
            currentVoter={currentVoter}
            nullifiers={nullifiers}
            onClose={() => setInspectingProposal(null)}
          />
        )}
      </div>
    </>
  );
}

