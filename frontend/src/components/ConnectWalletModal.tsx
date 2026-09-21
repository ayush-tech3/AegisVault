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
  Cpu
} from 'lucide-react';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletState: LaceWalletState;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
  walletState,
  onConnect,
  onDisconnect
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      await onConnect();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to connect Midnight Lace Wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-800 text-cyan-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Midnight Lace Wallet</h3>
              <p className="text-xs text-slate-400">Midnight DApp Connector API v0.19</p>
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
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Connection Status:</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Connected (Preprod)
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-500 block">Shielded Address</span>
                  <p className="font-mono text-xs text-cyan-300 bg-slate-900 p-2 rounded-lg border border-slate-800 break-all">
                    {walletState.address}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                  <span className="text-slate-400">Preprod Balance:</span>
                  <span className="font-mono font-bold text-white">
                    {walletState.balanceTDUST.toFixed(1)} tDUST
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onDisconnect();
                  onClose();
                }}
                className="w-full py-3 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-200 font-bold text-xs rounded-xl transition-all"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            /* Disconnected / Connect Button */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/50 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Shield className="w-4 h-4" />
                  Official Midnight Lace Connector
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Connect using the Midnight Lace browser extension. The wallet securely signs Compact zero-knowledge proofs and manages your private witness keys locally.
                </p>
              </div>

              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin text-cyan-300" />
                    Connecting to Midnight Node...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    Connect Midnight Lace Wallet
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <a
                  href="https://midnight.network"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-slate-500 hover:text-cyan-400 inline-flex items-center gap-1 transition-colors"
                >
                  Get Midnight Lace Wallet Extension
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
