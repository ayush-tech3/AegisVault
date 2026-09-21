import React from 'react';
import { ShieldCheck, Lock, Landmark, Cpu, ArrowUpRight } from 'lucide-react';

interface HeroStatsProps {
  totalCollateralUSD: number;
  totalBorrowedUSD: number;
  activeLoansCount: number;
  onDepositClick: () => void;
  onExploreCompliance: () => void;
}

export const HeroStats: React.FC<HeroStatsProps> = ({
  totalCollateralUSD,
  totalBorrowedUSD,
  activeLoansCount,
  onDepositClick,
  onExploreCompliance
}) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-12">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-cyan-500/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Heading & Subheading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-[11px] sm:text-xs font-semibold text-cyan-300 mb-4 sm:mb-6 shadow-inner max-w-full text-left">
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="truncate sm:overflow-visible">Midnight Compact v0.19 Smart Contract Live on Preprod</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 sm:mb-6 leading-tight">
            Confidential RWA Collateral &{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Selective Compliance
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 font-normal leading-relaxed px-1">
            Lock institutional real-world assets (T-Bills, Corporate Bonds, Property Equity) in zero-knowledge shielded vaults. Borrow liquidity with 150% over-collateralization proofs while retaining 100% balance-sheet privacy and granting selective disclosure keys to regulators.
          </p>

          {/* Action CTAs */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
            <button
              onClick={onDepositClick}
              className="w-full sm:w-auto justify-center px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Lock className="w-4 h-4 text-cyan-300" />
              Deposit Shielded RWA
            </button>
            <button
              onClick={onExploreCompliance}
              className="w-full sm:w-auto justify-center px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 font-bold text-sm rounded-xl flex items-center gap-2 transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Regulatory Audit Portal
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* 4 Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Shielded TVL</span>
              <Landmark className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              ${(totalCollateralUSD / 1_000_000).toFixed(2)}M
            </div>
            <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">
              <span>↑ 100% Zero-Knowledge Shielded</span>
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Borrow Volume</span>
              <ArrowUpRight className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              ${(totalBorrowedUSD / 1_000_000).toFixed(2)}M
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              {activeLoansCount} Active Credit Facilities
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Min Collateral Ratio</span>
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">150.0%</div>
            <p className="text-xs text-purple-300 mt-2 font-medium">
              Enforced by Compact ZK Circuit
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">ZK Privacy Engine</span>
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">BLS12-381</div>
            <p className="text-xs text-emerald-300 mt-2 font-medium">
              Client Prover (0 Identity Leak)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
