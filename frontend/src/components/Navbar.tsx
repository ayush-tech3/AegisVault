import React, { useState } from 'react';
import { Shield, Lock, Wallet, ExternalLink, Activity, EyeOff, CheckCircle, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'vaults' as const, label: 'Shielded Vaults', icon: Lock },
    { id: 'loans' as const, label: 'Active Loans', icon: Activity },
    { id: 'auditor' as const, label: 'Auditor Portal', icon: CheckCircle },
    { id: 'privacy' as const, label: 'Privacy Inspector', icon: EyeOff }
  ];

  const handleTabClick = (tab: 'vaults' | 'loans' | 'auditor' | 'privacy') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/90 border-b border-indigo-950/60 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => handleTabClick('vaults')}>
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                AegisVault
              </span>
              <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-indigo-950/80 text-cyan-300 border border-indigo-700/50 rounded-full">
                Preprod
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:block">Confidential RWA & Selective Compliance</p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.id === 'auditor' ? 'text-emerald-400' : item.id === 'privacy' ? 'text-cyan-400' : ''}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Network, Lace Wallet & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Contract Address Pill (Desktop Only) */}
          <div
            title={`Contract: ${AEGIS_VAULT_PREPROD_CONTRACT_ADDRESS}`}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-400"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Preprod:</span>
            <span className="font-mono text-cyan-300 font-semibold">
              {AEGIS_VAULT_PREPROD_CONTRACT_ADDRESS.slice(0, 6)}...{AEGIS_VAULT_PREPROD_CONTRACT_ADDRESS.slice(-4)}
            </span>
          </div>

          {/* Wallet Connect Button */}
          {walletState.isConnected ? (
            <div className="flex items-center gap-1 sm:gap-2 bg-slate-900 border border-indigo-900/60 rounded-xl p-1 sm:p-1.5 sm:pr-3 shadow-md">
              <div className="px-2 py-1 bg-indigo-950/80 border border-indigo-800/50 rounded-lg text-[11px] sm:text-xs font-mono text-cyan-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>{walletState.balanceTDUST.toFixed(1)} <span className="hidden sm:inline">tDUST</span></span>
              </div>
              <span className="text-[11px] sm:text-xs font-mono text-slate-300 font-medium hidden xs:inline">
                {walletState.address?.slice(0, 4)}...{walletState.address?.slice(-3)}
              </span>
              <button
                onClick={onDisconnectWallet}
                className="text-[11px] sm:text-xs text-slate-400 hover:text-rose-400 px-1 sm:px-1.5 py-0.5 rounded transition-colors"
                title="Disconnect Wallet"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenWalletModal}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 sm:gap-2 transition-all transform active:scale-95"
            >
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-indigo-900/60 px-4 pt-2 pb-6 space-y-2 backdrop-blur-xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 pb-3 pt-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`p-3 text-xs font-semibold rounded-xl transition-all flex flex-col items-center justify-center gap-1.5 border text-center ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.id === 'auditor' ? 'text-emerald-400' : item.id === 'privacy' ? 'text-cyan-400' : 'text-indigo-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Midnight Preprod Network
            </span>
            <span className="font-mono text-cyan-300">
              {AEGIS_VAULT_PREPROD_CONTRACT_ADDRESS.slice(0, 6)}...{AEGIS_VAULT_PREPROD_CONTRACT_ADDRESS.slice(-4)}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
