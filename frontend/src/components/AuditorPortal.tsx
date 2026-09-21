import React, { useState } from 'react';
import { AuditorDisclosureRecord, ActiveLoanRecord } from '../types';
import {
  ShieldCheck,
  Lock,
  Key,
  Building,
  CheckCircle,
  FileText,
  AlertCircle,
  Clock,
  ExternalLink,
  Plus
} from 'lucide-react';

interface AuditorPortalProps {
  disclosures: AuditorDisclosureRecord[];
  activeLoans: ActiveLoanRecord[];
  onGrantDisclosure: (loanId: string, auditorOrg: string) => Promise<AuditorDisclosureRecord>;
}

export const AuditorPortal: React.FC<AuditorPortalProps> = ({
  disclosures,
  activeLoans,
  onGrantDisclosure
}) => {
  const [selectedLoanId, setSelectedLoanId] = useState<string>(
    activeLoans[0]?.loanId || ''
  );
  const [auditorOrg, setAuditorOrg] = useState<string>('SEC / FINRA Compliance Examiner (US)');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanId) return;

    try {
      setIsSubmitting(true);
      setSuccessMsg(null);
      await onGrantDisclosure(selectedLoanId, auditorOrg);
      setSuccessMsg(`Selective audit viewing token granted to ${auditorOrg}!`);
    } catch (err: any) {
      alert(err.message || 'Failed to grant disclosure');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-900/60 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-700 text-xs font-bold text-cyan-300 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Midnight "Rational Privacy" Selective Compliance Engine
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Institutional Regulatory Compliance & Auditor Portal
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Midnight allows regulated institutions to maintain 100% shielded on-chain privacy while selectively granting cryptographically verified viewing keys to auditors (SEC, FINRA, ESMA, Big-4 Auditors) without publishing sensitive financial information to the public blockchain.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Grant Selective Disclosure Form */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            Grant Auditor Viewing Key
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Execute Compact circuit <code className="text-cyan-300 font-mono">grantAuditorDisclosure</code>
          </p>

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleGrant} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Credit Facility (Loan ID)
              </label>
              {activeLoans.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No active loans found to audit</p>
              ) : (
                <select
                  value={selectedLoanId}
                  onChange={e => setSelectedLoanId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                >
                  {activeLoans.map(loan => (
                    <option key={loan.loanId} value={loan.loanId}>
                      {loan.loanId} (${loan.principalAmountUSD.toLocaleString()})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Authorized Regulatory Agency / Auditor
              </label>
              <select
                value={auditorOrg}
                onChange={e => setAuditorOrg(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value="SEC / FINRA Compliance Examiner (US)">
                  🏛️ SEC / FINRA Compliance Examiner (US)
                </option>
                <option value="ESMA / MiCA European Regulatory Authority">
                  🇪🇺 ESMA / MiCA European Regulatory Authority
                </option>
                <option value="PwC / Deloitte Institutional Audit Division">
                  🏢 PwC / Deloitte Institutional Audit Division
                </option>
                <option value="FCA Financial Conduct Authority (UK)">
                  🇬🇧 FCA Financial Conduct Authority (UK)
                </option>
              </select>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 block">Cryptographic Binding:</span>
              <p>
                Generates a zero-knowledge viewing token derived from your shielded secret that decrypts only the specific loan's collateralization audit report for the regulator's public key.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || activeLoans.length === 0}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            >
              <ShieldCheck className="w-4 h-4" />
              {isSubmitting ? 'Granting Audit Access...' : 'Generate & Grant Audit Key'}
            </button>
          </form>
        </div>

        {/* Right: Active Regulatory Disclosures */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Active Cryptographic Audit Grants
              </h3>
              <p className="text-xs text-slate-400">
                Auditor viewing records cryptographically authenticated on Midnight Preprod
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-cyan-300 text-xs font-bold border border-indigo-800 font-mono">
              {disclosures.length} Granted
            </span>
          </div>

          <div className="space-y-3">
            {disclosures.map(record => (
              <div
                key={record.auditorKeyCommitment}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{record.auditorOrganization}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Loan Ref: {record.loanId}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                    {record.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 truncate">
                    <span className="text-slate-500 block">Auditor Key Hash:</span>
                    <span className="text-cyan-300">{record.auditorKeyCommitment}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 truncate">
                    <span className="text-slate-500 block">Encrypted Payload:</span>
                    <span className="text-purple-300">{record.encryptedViewingKey}</span>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/60 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Compliance Attestation: {record.verifiedComplianceTag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
