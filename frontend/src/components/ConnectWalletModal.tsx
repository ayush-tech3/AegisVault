import React, { useState } from 'react';
import { LaceWalletState } from '../types';
import {
  Wallet,
  X,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Shield,
  Key,
  Cpu,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletState: LaceWalletState;
  onConnectLace: () => Promise<void>;
  onConnectFreighter: () => Promise<void>;
  onConnectDemo: () => Promise<void>;
  onDisconnect: () => void;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
  walletState,
  onConnectLace,
  onConnectFreighter,
  onConnectDemo,
  onDisconnect
}) => {
  const [activeConnecting, setActiveConnecting] = useState<'lace' | 'freighter' | 'demo' | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (type: 'lace' | 'freighter' | 'demo', fn: () => Promise<void>) => {
    try {
      setActiveConnecting(type);
      setError(null);
      await fn();
      onClose();
    } catch (err: any) {
      setError(err.message || `Failed to connect ${type} wallet`);
    } finally {
      setActiveConnecting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-5 sm:p-8 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Connect Web3 Wallet</h3>
              <p className="text-xs text-slate-400">Select your preferred shielded or bridge provider</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {walletState.isConnected ? (
            /* Connected State */
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Active Provider:</span>
                  <span className="text-xs font-bold text-cyan-300 capitalize flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {walletState.walletType || 'Midnight Lace'} (Connected)
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-500 block">Shielded Address</span>
                  <p className="font-mono text-xs text-white bg-slate-900 p-2.5 rounded-xl border border-slate-800 break-all">
                    {walletState.address}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                  <span className="text-slate-400">Preprod Balance:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {walletState.balanceTDUST.toFixed(1)} tDUST
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onDisconnect();
                  onClose();
                }}
                className="w-full py-3 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-200 font-bold text-xs rounded-xl transition-all shadow-md"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            /* Multi-Wallet Selection Options */
            <div className="space-y-3">
              {/* Option 1: Midnight Lace Wallet */}
              <button
                onClick={() => handleConnect('lace', onConnectLace)}
                disabled={activeConnecting !== null}
                className="w-full p-4 rounded-2xl bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/60 transition-all flex items-center justify-between group text-left disabled:opacity-50"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">Midnight Lace Wallet</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-950 text-cyan-300 border border-indigo-800">
                        Official SDK
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Midnight DApp Connector API v0.19 (Preprod Network)
                    </p>
                  </div>
                </div>
                {activeConnecting === 'lace' ? (
                  <Cpu className="w-5 h-5 animate-spin text-cyan-400" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors"></div>
                )}
              </button>

              {/* Option 2: Freighter Wallet (Stellar Bridge) */}
              <button
                onClick={() => handleConnect('freighter', onConnectFreighter)}
                disabled={activeConnecting !== null}
                className="w-full p-4 rounded-2xl bg-slate-950/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/60 transition-all flex items-center justify-between group text-left disabled:opacity-50"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-700/60 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">Freighter Wallet</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                        Stellar Bridge
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Multi-chain cross-settlement for tokenized RWAs
                    </p>
                  </div>
                </div>
                {activeConnecting === 'freighter' ? (
                  <Cpu className="w-5 h-5 animate-spin text-purple-400" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-purple-400 transition-colors"></div>
                )}
              </button>

              {/* Option 3: Instant Demo Shielded Wallet */}
              <button
                onClick={() => handleConnect('demo', onConnectDemo)}
                disabled={activeConnecting !== null}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 hover:to-indigo-900/60 border border-slate-800 hover:border-cyan-500/60 transition-all flex items-center justify-between group text-left disabled:opacity-50"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">Instant Demo Shielded Wallet</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                        1-Click Test
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pre-funded with 2,500 tDUST for instant evaluator testing
                    </p>
                  </div>
                </div>
                {activeConnecting === 'demo' ? (
                  <Cpu className="w-5 h-5 animate-spin text-emerald-400" />
                ) : (
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                )}
              </button>

              <div className="text-center pt-2">
                <a
                  href="https://midnight.network"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-slate-500 hover:text-cyan-400 inline-flex items-center gap-1 transition-colors"
                >
                  Learn more about Midnight Lace Extension
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
