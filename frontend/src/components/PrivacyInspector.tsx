import React from 'react';
import { Shield, Lock, Eye, EyeOff, Check, X, FileCode, Cpu, ShieldCheck, Database, Key } from 'lucide-react';
import { AEGIS_VAULT_PREPROD_CONTRACT_ADDRESS, ACCREDITED_INVESTOR_MERKLE_ROOT } from '../services/midnight-client';

export const PrivacyInspector: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-xs font-bold text-purple-300 mb-3">
            <EyeOff className="w-4 h-4 text-purple-400" />
            Midnight Network Dual-State Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Zero-Knowledge Privacy Inspector
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Inspect the mathematical and cryptographic boundary between Midnight's <strong>Public Ledger</strong> (visible to all blockchain observers) and the <strong>Private Witness</strong> (executed locally on the borrower's device with 0 identity or balance leakage).
          </p>
        </div>

        {/* Quick Summary Pills */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">ZK Proof System</span>
            <span className="text-xl font-black text-cyan-300 font-mono">
              BLS12-381 PLONK
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Identity & Balance Leaks</span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              0.00% Leaked
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Over-Collateral Constraint</span>
            <span className="text-xl font-black text-purple-300 font-mono">
              ≥ 150.0% Enforced
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Dual-State Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Card: Public Ledger State (On-chain Midnight Preprod) */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Public Ledger State</h3>
                <p className="text-xs text-slate-400">Visible to Indexers, Block Explorers & Nodes</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              Preprod Network
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Contract Address</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {AEGIS_VAULT_PREPROD_CONTRACT_ADDRESS.slice(0, 8)}...{AEGIS_VAULT_PREPROD_CONTRACT_ADDRESS.slice(-6)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Collateral Commitment Map</span>
                <span className="text-emerald-400 font-semibold">✓ 32-Byte One-Way Hashes</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                <code>collateralCommitments: Map&lt;Bytes[32], Commitment&gt;</code>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Spent Nullifier Set</span>
                <span className="text-purple-400 font-semibold">✓ Anti-Double-Borrow</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                <code>spentNullifiers: Set&lt;Bytes[32]&gt;</code>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Total Protocol Borrowed</span>
                <span className="text-white font-mono font-bold">$500,000 USD</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Accredited KYC Merkle Root</span>
                <span className="font-mono text-cyan-300">{ACCREDITED_INVESTOR_MERKLE_ROOT.slice(0, 10)}...</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-900/40 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-cyan-400" />
              Public Verifiability Guarantee:
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Anyone can audit that total loans never exceed allowable limits and that every loan has a valid zero-knowledge mathematical proof verifying the ≥150% over-collateralization invariant.
            </p>
          </div>
        </div>

        {/* Right Card: Private Witness State (Client-Side Prover Only) */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-950 border border-purple-800 text-purple-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Private Witness State</h3>
                <p className="text-xs text-purple-400">Kept Exclusively in Browser / Lace Wallet</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-950 text-purple-300 border border-purple-800 font-mono">
              Never Disclosed
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-900/40 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Borrower Secret Key</span>
                <span className="text-rose-400 font-semibold font-mono">⛔ SHIELDED</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                <code>witness getBorrowerSecret(): Bytes[32]</code>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-900/40 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Exact Collateral Value (USD)</span>
                <span className="text-rose-400 font-semibold font-mono">⛔ SHIELDED</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                <code>witness getCollateralValueUSD(): Uint&lt;64&gt;</code>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-900/40 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">RWA Asset Breakdown & Salt</span>
                <span className="text-rose-400 font-semibold font-mono">⛔ SHIELDED</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                <code>witness getCollateralSalt(): Bytes[32]</code>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-900/40 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">KYC Merkle Authentication Path</span>
                <span className="text-rose-400 font-semibold font-mono">⛔ SHIELDED</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                <code>witness getAccreditedMerkleProof(): Vector&lt;Bytes[32], 16&gt;</code>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-900/40 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-purple-300 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-purple-400" />
              Institutional Privacy Guarantee:
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Competitors, block builders, and blockchain analytics firms can never see your portfolio size, specific Treasury holdings, or borrowing patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
