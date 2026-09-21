import React from 'react';
import { Shield, Lock, Wallet, ExternalLink, Activity, EyeOff, CheckCircle } from 'lucide-react';
import { LaceWalletState } from '../types';
import { AEGIS_VAULT_PREPROD_CONTRACT_ADDRESS } from '../services/midnight-client';

interface NavbarProps {
  activeTab: 'vaults' | 'loans' | 'auditor' | 'privacy';
  setActiveTab: (tab: 'vaults' | 'loans' | 'auditor' | 'privacy') => void;
  walletState: LaceWalletState;
  onOpenWalletModal: () => void;
  onDisconnectWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  walletState,
  onOpenWalletModal,
  onDisconnectWallet
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-indigo-950/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('vaults')}>
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                AegisVault
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-indigo-950/80 text-cyan-300 border border-indigo-700/50 rounded-full">
                Midnight Preprod
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Confidential RWA & Selective Compliance</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => setActiveTab('vaults')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'vaults'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Lock className="w-4 h-4" />
            Shielded Vaults
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'loans'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            Active Loans
          </button>
          <button
            onClick={() => setActiveTab('auditor')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'auditor'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Auditor Portal
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <EyeOff className="w-4 h-4 text-cyan-400" />
            Privacy Inspector
          </button>
        </nav>

        {/* Right Section: Network & Lace Wallet */}
        <div className="flex items-center gap-3">
          {/* Contract Address Pill */}
          <div
            title={`Contract: ${AEGIS_VAULT_PREPROD_CONTRACT_ADDRESS}`}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-400"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Preprod:</span>
            <span className="font-mono text-cyan-300 font-semibold">
              {AEGIS_VAULT_PREPROD_CONTRACT_ADDRESS.slice(0, 6)}...{AEGIS_VAULT_PREPROD_CONTRACT_ADDRESS.slice(-4)}
            </span>
          </div>

          {/* Lace Wallet Connect Button */}
          {walletState.isConnected ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-indigo-900/60 rounded-xl p-1.5 pr-3 shadow-md">
              <div className="px-2.5 py-1 bg-indigo-950/80 border border-indigo-800/50 rounded-lg text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                {walletState.balanceTDUST.toFixed(1)} tDUST
              </div>
              <span className="text-xs font-mono text-slate-300 font-medium">
                {walletState.address?.slice(0, 8)}...{walletState.address?.slice(-4)}
              </span>
              <button
                onClick={onDisconnectWallet}
                className="text-xs text-slate-500 hover:text-rose-400 ml-1 transition-colors"
                title="Disconnect Lace Wallet"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenWalletModal}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Wallet className="w-4 h-4" />
              Connect Lace Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
