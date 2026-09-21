import React, { useState } from 'react';
import {
  VaultAssetType,
  ShieldedVaultAsset,
  ShieldedCollateralRecord
} from '../types';
import { AVAILABLE_RWA_ASSETS } from './VaultsDashboard';
import {
  Lock,
  X,
  Shield,
  Key,
  CheckCircle,
  Eye,
  EyeOff,
  AlertCircle,
  Cpu
} from 'lucide-react';
import { generateRandomHex } from '../services/crypto-browser';

interface DepositCollateralModalProps {
  initialAsset?: ShieldedVaultAsset;
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (
    assetType: VaultAssetType,
    assetName: string,
    amountUSD: number,
    secretKey: string
  ) => Promise<ShieldedCollateralRecord>;
}

export const DepositCollateralModal: React.FC<DepositCollateralModalProps> = ({
  initialAsset,
  isOpen,
  onClose,
  onDeposit
}) => {
  const [selectedAsset, setSelectedAsset] = useState<ShieldedVaultAsset>(
    initialAsset || AVAILABLE_RWA_ASSETS[0]
  );
  const [amountUSD, setAmountUSD] = useState<number>(500000);
  const [secretKey, setSecretKey] = useState<string>(() => generateRandomHex(32));
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amountUSD <= 0) {
      setError('Please enter a valid deposit amount greater than $0');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onDeposit(selectedAsset.assetType, selectedAsset.name, amountUSD, secretKey);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to deposit shielded collateral');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-800 text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Deposit Shielded RWA Collateral</h3>
              <p className="text-xs text-slate-400">Midnight Compact Circuit: depositShieldedCollateral</p>
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
          <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Asset Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select RWA Asset Tier
            </label>
            <select
              value={selectedAsset.id}
              onChange={e => {
                const found = AVAILABLE_RWA_ASSETS.find(a => a.id === e.target.value);
                if (found) setSelectedAsset(found);
              }}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {AVAILABLE_RWA_ASSETS.map(asset => (
                <option key={asset.id} value={asset.id}>
                  {asset.icon} {asset.name} ({asset.apr}% Yield)
                </option>
              ))}
            </select>
          </div>

          {/* Deposit Amount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Collateral Value (USD)
              </label>
              <span className="text-xs text-slate-500 font-mono">
                Min Over-Collateralization: {selectedAsset.minRatioPercent}%
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                min="1000"
                step="1000"
                value={amountUSD}
                onChange={e => setAmountUSD(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-base font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="500000"
                required
              />
            </div>
          </div>

          {/* Private Secret Key (Client-Side Witness) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                Borrower Shielded Secret (Private Witness)
              </label>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showSecret ? 'Hide' : 'Reveal'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={secretKey}
                onChange={e => setSecretKey(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-purple-900/60 rounded-xl font-mono text-xs text-purple-300 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              ⚠️ This secret is kept solely in your local browser memory. It never touches the public network.
            </p>
          </div>

          {/* Privacy Guarantee Box */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-900/60 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
              <Shield className="w-4 h-4" />
              What will be published on Midnight Preprod?
            </div>
            <p className="text-slate-400 leading-relaxed">
              Only a one-way cryptographic commitment: <br />
              <code className="text-purple-300 font-mono text-[10px]">
                Hash(secret, salt, amount, assetType)
              </code>
              <br />
              Nobody on-chain can see your deposit amount or your identity.
            </p>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin text-cyan-300" />
                  Generating Commitment...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Lock & Shield Collateral
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
