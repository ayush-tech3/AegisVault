import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { ProposalCard } from './components/ProposalCard.tsx';
import { CastVoteModal } from './components/CastVoteModal.tsx';
import { CreateProposalModal } from './components/CreateProposalModal.tsx';
import { PrivacyInspector } from './components/PrivacyInspector.tsx';
import { ComplianceBadge } from './components/ComplianceBadge.tsx';
import { midnightClient, SEED_VOTERS } from './services/midnight-client.ts';
import { Proposal, VoteTally, VoterProfile, LedgerLog } from './types/index.ts';
import { Shield, Sparkles, Activity, FileCheck2, Cpu } from 'lucide-react';

export function App() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [tallies, setTallies] = useState<Map<string, VoteTally>>(new Map());
  const [logs, setLogs] = useState<LedgerLog[]>([]);
  const [nullifiers, setNullifiers] = useState<string[]>([]);
  const [currentVoter, setCurrentVoter] = useState<VoterProfile>(SEED_VOTERS[0]);
  const [isLace, setIsLace] = useState(false);

  // Modals state
  const [votingProposal, setVotingProposal] = useState<Proposal | null>(null);
  const [inspectingProposal, setInspectingProposal] = useState<Proposal | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      await midnightClient.init();
      refreshData();
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
    setIsLace(midnightClient.isUsingLace());
  };

  const handleSelectVoter = (voter: VoterProfile) => {
    midnightClient.setConnectedVoter(voter);
    setCurrentVoter(voter);
  };

  const handleCastVote = async (proposalId: string, choiceIndex: number) => {
    await midnightClient.castVote(proposalId, choiceIndex);
    refreshData();
  };

  const handleCreateProposal = async (title: string, description: string, options: string[]) => {
    await midnightClient.createProposal(title, description, options);
    refreshData();
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Navigation */}
      <Navbar
        currentVoter={currentVoter}
        onSelectVoter={handleSelectVoter}
        isLace={isLace}
        onOpenCreateModal={() => setIsCreateOpen(true)}
      />

      {/* Hero Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem', margin: '2rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-shielded" style={{ padding: '0.35rem 0.75rem' }}>
              <Sparkles size={14} /> Zero-Knowledge Privacy Architecture
            </span>
            <span className="badge badge-active" style={{ padding: '0.35rem 0.75rem' }}>
              <Cpu size={14} /> Compact Smart Contract v0.19
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '1rem' }}>
            Confidential Governance & Secret Ballots on Midnight
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            VeilVote utilizes Midnight’s dual-state zero-knowledge paradigm to guarantee mathematically confidential votes. Observers and blockchain indexers verify proof correctness, voter eligibility, and single-use nullifiers without ever learning who voted for which outcome.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                if (proposals.length > 0) setInspectingProposal(proposals[0]);
              }}
              className="btn btn-cyan"
              id="btn-hero-inspect"
            >
              <Shield size={16} /> Open Privacy Model Inspector
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="btn btn-secondary"
              id="btn-hero-create"
            >
              + Create New Ballot
            </button>
          </div>
        </div>
      </div>

      {/* Proposals Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
              Active Governance Proposals
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Cast your secret ballot using client-side zero-knowledge witness generation
            </span>
          </div>
          <span className="badge badge-active">
            {proposals.length} Proposals Live
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem' }}>
          {proposals.map((prop) => (
            <ProposalCard
              key={prop.id}
              proposal={prop}
              tally={tallies.get(prop.id)}
              onVoteClick={(p) => setVotingProposal(p)}
              onInspectClick={(p) => setInspectingProposal(p)}
            />
          ))}
        </div>
      </div>

      {/* Live Blockchain Event Feed */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Activity size={20} color="#38bdf8" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            Live Midnight Public Ledger Feed
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {logs.slice(0, 5).map((log) => (
            <div
              key={log.id}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span className={`badge ${log.type === 'VOTE_CAST' ? 'badge-shielded' : 'badge-active'}`}>
                  {log.type}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  {log.publicDetails}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Certification Panel */}
      <ComplianceBadge />

      {/* Modals */}
      <CastVoteModal
        proposal={votingProposal}
        voter={currentVoter}
        onClose={() => setVotingProposal(null)}
        onSubmitVote={handleCastVote}
      />

      <CreateProposalModal
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateProposal}
      />

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
  );
}
