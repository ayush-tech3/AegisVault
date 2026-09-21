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
  Cpu,
  ArrowRight
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
  const activeLoans = loans.filter(l => l.status === LoanStatus.Active);
  const totalBorrowedActive = activeLoans.reduce((acc, l) => acc + l.principalAmountUSD, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-xs font-bold text-cyan-300 mb-3">
            <Activity className="w-4 h-4 text-cyan-400" />
            Midnight Preprod Active Credit Lines
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Active Shielded Credit Facilities
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Manage your active loans, monitor real-time Zero-Knowledge nullifier states on Midnight Preprod, execute repayments to release shielded RWA collateral, or issue selective regulatory viewing tokens.
          </p>
        </div>

        {/* Quick Loan Statistics */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Total Active Borrow Debt</span>
            <span className="text-2xl font-black text-white font-mono">
              ${totalBorrowedActive.toLocaleString()} USD
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Active Loan Contracts</span>
            <span className="text-2xl font-black text-cyan-300 font-mono">
              {activeLoans.length} Facilities
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Average Interest Rate</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              4.50% APR
            </span>
          </div>
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-dashed border-slate-800">
          <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg text-slate-200 font-bold">No Active Credit Facilities</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            You currently have no open loans. Go to the <strong>Shielded Vaults</strong> page to deposit RWA collateral and generate a ZK borrow proof.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>On-Chain Verified Loan Agreements</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {loans.length} Total
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {loans.map(loan => (
              <div
                key={loan.loanId}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl hover:border-cyan-500/40 transition-all"
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
                      <span className="text-slate-500 block">Principal Amount</span>
                      <span className="text-base font-extrabold text-white font-mono">
                        ${loan.principalAmountUSD.toLocaleString()} USD
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Interest Rate</span>
                      <span className="text-base font-bold text-cyan-300 font-mono">
                        {(loan.interestRateBps / 100).toFixed(2)}% APR
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Spent ZK Nullifier</span>
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
                    BLS12-381 Proof Hash: <span className="text-slate-400 truncate">{loan.zkProofHash}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row lg:flex-col items-stretch gap-3 self-end lg:self-center w-full lg:w-auto">
                  {loan.status === LoanStatus.Active && (
                    <button
                      onClick={() => onRepayLoan(loan.loanId)}
                      className="flex-1 lg:flex-none px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Repay & Release RWA
                    </button>
                  )}
                  <button
                    onClick={() => onOpenAuditorModal(loan)}
                    className="flex-1 lg:flex-none px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Grant Auditor Key
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
