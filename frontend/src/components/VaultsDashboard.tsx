import React from 'react';
import {
  VaultAssetType,
  ShieldedVaultAsset,
  ShieldedCollateralRecord
} from '../types';
import {
  Lock,
  PlusCircle,
  TrendingUp,
  Shield,
  Building,
  DollarSign,
  FileCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface VaultsDashboardProps {
  collateralRecords: ShieldedCollateralRecord[];
  onOpenDepositModal: (asset?: ShieldedVaultAsset) => void;
  onOpenBorrowModal: (collateral: ShieldedCollateralRecord) => void;
}

export const AVAILABLE_RWA_ASSETS: ShieldedVaultAsset[] = [
  {
    id: 'tbills',
    name: 'US Treasury 3-Month T-Bills (Series 2026-Q3)',
    ticker: 'USD-TBILL',
    assetType: VaultAssetType.USTreasuryBills,
    apr: 5.25,
    totalDepositedUSD: 18500000,
    minRatioPercent: 150,
    underlyingRating: 'AAA (Fitch / Moody’s)',
    custodian: 'BNY Mellon Shielded Custody',
    icon: '🏛️'
  },
  {
    id: 'corp-bonds',
    name: 'Apple / Microsoft AAA Senior Corporate Notes',
    ticker: 'AAA-CORP',
    assetType: VaultAssetType.CorporateBonds,
    apr: 6.10,
    totalDepositedUSD: 12400000,
    minRatioPercent: 150,
    underlyingRating: 'AAA (S&P Global)',
    custodian: 'State Street Digital',
    icon: '🏢'
  },
  {
    id: 'real-estate',
    name: 'Manhattan Class-A Commercial Real Estate Equity',
    ticker: 'NYC-CRE',
    assetType: VaultAssetType.CommercialRealEstate,
    apr: 8.45,
    totalDepositedUSD: 8950000,
    minRatioPercent: 160,
    underlyingRating: 'Institutional Equity Tier-1',
    custodian: 'Apex Real Estate Trust',
    icon: '🏙️'
  },
  {
    id: 'priv-credit',
    name: 'Institutional Syndicated Senior Credit Facility',
    ticker: 'PRIV-CREDIT',
    assetType: VaultAssetType.PrivateCredit,
    apr: 9.80,
    totalDepositedUSD: 3000000,
    minRatioPercent: 150,
    underlyingRating: 'A+ (Duff & Phelps)',
    custodian: 'Wilmington Trust Escrow',
    icon: '📜'
  }
];

export const VaultsDashboard: React.FC<VaultsDashboardProps> = ({
  collateralRecords,
  onOpenDepositModal,
  onOpenBorrowModal
}) => {
  return (
    <div className="space-y-12">
      {/* 1. Available RWA Collateral Asset Tiers */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              Verified Institutional RWA Collateral Vaults
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Select an asset tier to commit shielded collateral on Midnight Preprod network
            </p>
          </div>
          <button
            onClick={() => onOpenDepositModal()}
            className="w-full sm:w-auto justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Deposit New Collateral
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {AVAILABLE_RWA_ASSETS.map(asset => (
            <div
              key={asset.id}
              className="p-4 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="text-2xl sm:text-3xl flex-shrink-0">{asset.icon}</span>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {asset.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                        <span className="font-mono text-xs text-indigo-400 font-semibold">
                          {asset.ticker}
                        </span>
                        <span className="text-slate-600 hidden sm:inline">•</span>
                        <span className="text-[11px] sm:text-xs text-slate-400">{asset.underlyingRating}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-[11px] sm:text-xs font-bold rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1 flex-shrink-0">
                    <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {asset.apr}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs mb-4">
                  <div>
                    <span className="text-slate-500 block">Total Pool TVL</span>
                    <span className="font-bold text-slate-200">
                      ${(asset.totalDepositedUSD / 1_000_000).toFixed(1)}M USD
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Min Over-Collateralization</span>
                    <span className="font-bold text-cyan-300">{asset.minRatioPercent}%</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-indigo-400" />
                    Custodian: <span className="text-slate-300">{asset.custodian}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-slate-500">Compact Circuit v0.19</span>
                <button
                  onClick={() => onOpenDepositModal(asset)}
                  className="px-4 py-2 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Deposit & Shield
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. User's Shielded Collateral Commitments */}
      <div className="pt-4 border-t border-slate-800">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Lock className="w-6 h-6 text-purple-400" />
            Your Shielded Collateral Commitments
          </h2>
          <p className="text-sm text-slate-400">
            Cryptographic commitments recorded on Midnight Preprod ledger. Only your local wallet holds the private witness data.
          </p>
        </div>

        {collateralRecords.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
            <Lock className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400 font-medium">No shielded collateral commitments found</p>
            <p className="text-xs text-slate-500 mt-1">Deposit an RWA asset above to generate your first zero-knowledge commitment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {collateralRecords.map(record => (
              <div
                key={record.commitmentHash}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white text-sm">{record.assetName}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Deposited on {new Date(record.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        record.status === 'Deposited'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                          : record.status === 'BorrowedAgainst'
                          ? 'bg-indigo-950/80 text-cyan-300 border-indigo-800/60'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {record.status === 'BorrowedAgainst' ? 'Utilized in Loan' : record.status}
                    </span>
                  </div>

                  {/* Private vs Public View Pill */}
                  <div className="space-y-2 mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-purple-400" />
                        Private Collateral (Witness):
                      </span>
                      <span className="font-mono font-bold text-white text-sm">
                        ${record.depositedAmountUSD.toLocaleString()} USD
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] font-mono">
                      <span className="text-slate-500 block">On-Chain Commitment Hash (Public):</span>
                      <span className="text-cyan-300 break-all">{record.commitmentHash}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-xs text-slate-400">
                    Max Borrow (150%):{' '}
                    <strong className="text-slate-200">
                      ${Math.floor(record.depositedAmountUSD / 1.5).toLocaleString()} USD
                    </strong>
                  </span>
                  {record.status === 'Deposited' ? (
                    <button
                      onClick={() => onOpenBorrowModal(record)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      Borrow Against RWA
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium italic">
                      Active Loan in Progress
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
