import React from 'react';
import { ActiveLoanRecord, LoanStatus } from '../types';
import {
  Activity,
  CheckCircle,
  Clock,
  ShieldCheck,
  DollarSign,
  Lock,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { AEGIS_VAULT_PREPROD_CONTRACT_ADDRESS } from '../services/midnight-client';

interface ActiveLoansViewProps {
  loans: ActiveLoanRecord[];
  onRepayLoan: (loanId: string) => Promise<void>;
  onOpenAuditorModal: (loan: ActiveLoanRecord) => void;
}

export const ActiveLoansView: React.FC<ActiveLoansViewProps> = ({
  loans,
  onRepayLoan,
  onOpenAuditorModal
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            Active Shielded Credit Facilities
          </h2>
          <p className="text-sm text-slate-400">
            Real-time on-chain loan agreements verified via Zero-Knowledge proofs on Midnight Preprod
          </p>
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-dashed border-slate-800">
          <Activity className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-base text-slate-300 font-semibold">No active loans found</p>
          <p className="text-xs text-slate-500 mt-1">
            Deposit RWA collateral in the Vaults tab and generate a ZK proof to open your first credit facility.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {loans.map(loan => (
            <div
              key={loan.loanId}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-bold text-white bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                    {loan.loanId}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                      loan.status === LoanStatus.Active
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    {loan.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    Opened {new Date(loan.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500 block">Principal Borrowed</span>
                    <span className="text-base font-extrabold text-white font-mono">
                      ${loan.principalAmountUSD.toLocaleString()} USD
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Interest Rate</span>
                    <span className="text-base font-bold text-cyan-300 font-mono">
                      {(loan.interestRateBps / 100).toFixed(1)}% APR
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ZK Nullifier</span>
                    <span className="font-mono text-purple-300 truncate block" title={loan.nullifier}>
                      {loan.nullifier.slice(0, 10)}...
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Accredited Merkle Root</span>
                    <span className="font-mono text-slate-300 truncate block" title={loan.accreditedRoot}>
                      {loan.accreditedRoot.slice(0, 10)}...
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  Proof Hash: <span className="text-slate-400 truncate">{loan.zkProofHash}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row lg:flex-col items-stretch gap-3 self-end lg:self-center w-full lg:w-auto">
                {loan.status === LoanStatus.Active && (
                  <button
                    onClick={() => onRepayLoan(loan.loanId)}
                    className="flex-1 lg:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Repay & Release
                  </button>
                )}
                <button
                  onClick={() => onOpenAuditorModal(loan)}
                  className="flex-1 lg:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Selective Disclosure
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
