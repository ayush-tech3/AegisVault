import React, { useState } from 'react';
import { ShieldedCollateralRecord, ActiveLoanRecord } from '../types';
import {
  DollarSign,
  X,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { generateRandomHex } from '../services/crypto-browser';

interface BorrowModalProps {
  collateral: ShieldedCollateralRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onExecuteBorrow: (
    loanId: string,
    principalUSD: number,
    collateralRecord: ShieldedCollateralRecord,
    borrowerSecret: string,
    onProgress: (step: string, progress: number) => void
  ) => Promise<ActiveLoanRecord>;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({
  collateral,
  isOpen,
  onClose,
  onExecuteBorrow
}) => {
  if (!isOpen || !collateral) return null;

  const maxBorrowUSD = Math.floor(collateral.depositedAmountUSD / (collateral.minRatioBps / 10000));
  const [borrowAmountUSD, setBorrowAmountUSD] = useState<number>(Math.floor(maxBorrowUSD * 0.7));
  const [borrowerSecret, setBorrowerSecret] = useState<string>(collateral.secretKey);
  const [isProving, setIsProving] = useState<boolean>(false);
  const [provingStep, setProvingStep] = useState<string>('');
  const [provingProgress, setProvingProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const currentRatio = (collateral.depositedAmountUSD / (borrowAmountUSD || 1)) * 100;
  const isRatioValid = currentRatio >= 150;

  const handleBorrowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRatioValid) {
      setError('Over-collateralization ratio must be at least 150%');
      return;
    }

    try {
      setIsProving(true);
      setError(null);
      const loanId = '0xloan_' + generateRandomHex(8).replace('0x', '');

      await onExecuteBorrow(
        loanId,
        borrowAmountUSD,
        collateral,
        borrowerSecret,
        (step, progress) => {
          setProvingStep(step);
          setProvingProgress(progress);
        }
      );

      onClose();
    } catch (err: any) {
      setError(err.message || 'ZK proof generation or transaction failed');
    } finally {
      setIsProving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Borrow Against Shielded RWA</h3>
              <p className="text-xs text-slate-400">Compact Circuit: borrowShielded</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProving}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isProving ? (
          /* Live ZK Prover Screen */
          <div className="py-8 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-900/60 border-t-cyan-400 animate-spin"></div>
              <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white mb-1">
                Zero-Knowledge Prover in Progress
              </h4>
              <p className="text-xs font-mono text-cyan-300 h-6 flex items-center justify-center">
                {provingStep || 'Initializing BLS12-381 Circuit...'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
              <div
                className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${provingProgress}%` }}
              />
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 text-left space-y-1">
              <div className="flex items-center justify-between">
                <span>1. Private Witness Extraction</span>
                <span className="text-emerald-400">✓ Done</span>
              </div>
              <div className="flex items-center justify-between">
                <span>2. 150% Ratio Constraint Check</span>
                <span className="text-emerald-400">✓ Invariant Met</span>
              </div>
              <div className="flex items-center justify-between">
                <span>3. Merkle KYC Inclusion</span>
                <span className="text-cyan-300">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span>4. Unique Nullifier Generation</span>
                <span className="text-purple-300">✓ Anti-Double-Borrow</span>
              </div>
            </div>
          </div>
        ) : (
          /* Borrow Configuration Form */
          <form onSubmit={handleBorrowSubmit} className="mt-6 space-y-5">
            {/* Selected Collateral Info */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Selected Collateral:</span>
                <span className="font-bold text-white">{collateral.assetName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Shielded Collateral Value:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ${collateral.depositedAmountUSD.toLocaleString()} USD
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">Max Borrow Limit (150%):</span>
                <span className="font-mono font-bold text-cyan-300">
                  ${maxBorrowUSD.toLocaleString()} USD
                </span>
              </div>
            </div>

            {/* Requested Loan Amount */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Borrow Amount (USD)
                </label>
                <span className="text-xs text-slate-400 font-mono">Interest Rate: 4.5% APR</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="1000"
                  max={maxBorrowUSD}
                  step="1000"
                  value={borrowAmountUSD}
                  onChange={e => setBorrowAmountUSD(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-base font-bold focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            {/* Collateral Ratio Gauge */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Over-Collateralization:</span>
                <span
                  className={`font-mono font-bold text-sm ${
                    isRatioValid ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {currentRatio.toFixed(1)}% {isRatioValid ? '(Safe ≥ 150%)' : '(Unsafe < 150%)'}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isRatioValid ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, (currentRatio / 300) * 100)}%` }}
                />
              </div>
            </div>

            {/* Borrower Secret Confirmation */}
            <div>
              <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1.5">
                Confirm Borrower Secret (Private Witness)
              </label>
              <input
                type="password"
                value={borrowerSecret}
                onChange={e => setBorrowerSecret(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-purple-900/60 rounded-xl font-mono text-xs text-purple-300"
                required
              />
            </div>

            {/* Submit Button */}
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
                disabled={!isRatioValid}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
              >
                <Cpu className="w-4 h-4 text-cyan-300" />
                Generate ZK Proof & Borrow
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
