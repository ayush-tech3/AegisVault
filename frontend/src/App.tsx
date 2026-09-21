import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroStats } from './components/HeroStats';
import { VaultsDashboard } from './components/VaultsDashboard';
import { ActiveLoansView } from './components/ActiveLoansView';
import { AuditorPortal } from './components/AuditorPortal';
import { PrivacyInspector } from './components/PrivacyInspector';
import { DepositCollateralModal } from './components/DepositCollateralModal';
import { BorrowModal } from './components/BorrowModal';
import { ConnectWalletModal } from './components/ConnectWalletModal';

import {
  VaultAssetType,
  ShieldedVaultAsset,
  ShieldedCollateralRecord,
  ActiveLoanRecord,
  AuditorDisclosureRecord,
  LaceWalletState
} from './types';
import {
  MidnightAegisClient,
  AEGIS_VAULT_PREPROD_CONTRACT_ADDRESS
} from './services/midnight-client';
import { Shield, Lock, ExternalLink, CheckCircle, Cpu, Code2 } from 'lucide-react';

export function App() {
  const client = MidnightAegisClient.getInstance();

  const [activeTab, setActiveTab] = useState<'vaults' | 'loans' | 'auditor' | 'privacy'>('vaults');
  const [collateralRecords, setCollateralRecords] = useState<ShieldedCollateralRecord[]>([]);
  const [activeLoans, setActiveLoans] = useState<ActiveLoanRecord[]>([]);
  const [auditorDisclosures, setAuditorDisclosures] = useState<AuditorDisclosureRecord[]>([]);

  // Modals state
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositSelectedAsset, setDepositSelectedAsset] = useState<ShieldedVaultAsset | undefined>();
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [borrowSelectedCollateral, setBorrowSelectedCollateral] = useState<ShieldedCollateralRecord | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Lace Wallet State
  const [walletState, setWalletState] = useState<LaceWalletState>({
    isConnected: true,
    address: 'midnight1qpv7x428g70k37a90...preprod',
    networkId: 'preprod',
    balanceTDUST: 850.0,
    isConnecting: false,
    error: null
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const refreshState = () => {
    setCollateralRecords(client.getCollateralRecords());
    setActiveLoans(client.getActiveLoans());
    setAuditorDisclosures(client.getAuditorDisclosures());
  };

  useEffect(() => {
    refreshState();
  }, []);

  // Handlers
  const handleConnectWallet = async () => {
    const res = await client.connectLaceWallet();
    setWalletState(res);
    if (res.isConnected) {
      showToast('Midnight Lace Wallet connected successfully to Preprod network!');
    }
  };

  const handleDisconnectWallet = () => {
    setWalletState({
      isConnected: false,
      address: null,
      networkId: 'preprod',
      balanceTDUST: 0,
      isConnecting: false,
      error: null
    });
    showToast('Wallet disconnected');
  };

  const handleDepositCollateral = async (
    assetType: VaultAssetType,
    assetName: string,
    amountUSD: number,
    secretKey: string
  ) => {
    const record = await client.depositShieldedCollateral(assetType, assetName, amountUSD, secretKey);
    refreshState();
    showToast(`Deposited $${amountUSD.toLocaleString()} into shielded vault (Commitment Hash created).`);
    return record;
  };

  const handleExecuteBorrow = async (
    loanId: string,
    principalUSD: number,
    collateralRecord: ShieldedCollateralRecord,
    borrowerSecret: string,
    onProgress: (step: string, progress: number) => void
  ) => {
    const loan = await client.executeBorrowCircuit(
      loanId,
      principalUSD,
      collateralRecord,
      borrowerSecret,
      onProgress
    );
    refreshState();
    setActiveTab('loans');
    showToast(`ZK Proof generated! Loan ${loanId} for $${principalUSD.toLocaleString()} active on Preprod.`);
    return loan;
  };

  const handleRepayLoan = async (loanId: string) => {
    await client.repayLoan(loanId);
    refreshState();
    showToast(`Loan ${loanId} successfully repaid and collateral unlocked.`);
  };

  const handleGrantAuditorDisclosure = async (loanId: string, auditorOrg: string) => {
    const rec = await client.grantAuditorDisclosure(loanId, auditorOrg);
    refreshState();
    showToast(`Granted cryptographic audit viewing access to ${auditorOrg}!`);
    return rec;
  };

  const totalCollateral = client.getTotalCollateralUSD();
  const totalBorrowed = client.getTotalBorrowedUSD();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900/95 border border-indigo-500/60 rounded-2xl shadow-2xl backdrop-blur-lg animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold text-white">{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        walletState={walletState}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onDisconnectWallet={handleDisconnectWallet}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero & Metrics Header */}
        <HeroStats
          totalCollateralUSD={totalCollateral}
          totalBorrowedUSD={totalBorrowed}
          activeLoansCount={activeLoans.filter(l => l.status === 'Active').length}
          onDepositClick={() => {
            setDepositSelectedAsset(undefined);
            setIsDepositModalOpen(true);
          }}
          onExploreCompliance={() => setActiveTab('auditor')}
        />

        {/* Tab Content */}
        {activeTab === 'vaults' && (
          <VaultsDashboard
            collateralRecords={collateralRecords}
            onOpenDepositModal={asset => {
              setDepositSelectedAsset(asset);
              setIsDepositModalOpen(true);
            }}
            onOpenBorrowModal={collateral => {
              setBorrowSelectedCollateral(collateral);
              setIsBorrowModalOpen(true);
            }}
          />
        )}

        {activeTab === 'loans' && (
          <ActiveLoansView
            loans={activeLoans}
            onRepayLoan={handleRepayLoan}
            onOpenAuditorModal={loan => setActiveTab('auditor')}
          />
        )}

        {activeTab === 'auditor' && (
          <AuditorPortal
            disclosures={auditorDisclosures}
            activeLoans={activeLoans.filter(l => l.status === 'Active')}
            onGrantDisclosure={handleGrantAuditorDisclosure}
          />
        )}

        {activeTab === 'privacy' && <PrivacyInspector />}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-900 bg-slate-950/80 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <Shield className="w-4 h-4 text-cyan-400" />
              AegisVault Protocol
            </div>
            <span>•</span>
            <span>Midnight Network Preprod</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-slate-400">
              Contract: {AEGIS_VAULT_PREPROD_CONTRACT_ADDRESS.slice(0, 10)}...
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ayush-tech3/AegisVault"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <Code2 className="w-4 h-4" />
              GitHub Repository
            </a>
            <a
              href="https://midnight.network"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              Midnight Docs
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DepositCollateralModal
        isOpen={isDepositModalOpen}
        initialAsset={depositSelectedAsset}
        onClose={() => setIsDepositModalOpen(false)}
        onDeposit={handleDepositCollateral}
      />

      <BorrowModal
        isOpen={isBorrowModalOpen}
        collateral={borrowSelectedCollateral}
        onClose={() => setIsBorrowModalOpen(false)}
        onExecuteBorrow={handleExecuteBorrow}
      />

      <ConnectWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        walletState={walletState}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
      />
    </div>
  );
}
