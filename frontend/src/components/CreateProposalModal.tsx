import React, { useState } from 'react';
import { Plus, Trash2, X, FileText, Sparkles } from 'lucide-react';

interface CreateProposalModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, options: string[]) => Promise<void>;
}

export const CreateProposalModal: React.FC<CreateProposalModalProps> = ({
  isOpen = true,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['Approve', 'Reject']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddOption = () => {
    if (options.length >= 6) return;
    setOptions([...options, `Option ${options.length + 1}`]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide a title and description.');
      return;
    }
    if (options.some(opt => !opt.trim())) {
      setError('All options must have valid labels.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(title.trim(), description.trim(), options);
      setTitle('');
      setDescription('');
      setOptions(['Approve', 'Reject']);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish proposal';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(6, 182, 212, 0.2)', borderRadius: '10px' }}>
              <FileText size={20} color="#06b6d4" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Create Confidential Governance Proposal
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            id="btn-close-proposal-modal"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Proposal Title
            </label>
            <input
              type="text"
              placeholder="e.g. MIP-05: Fund Privacy Grant Program"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              id="input-proposal-title"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Proposal Description
            </label>
            <textarea
              rows={3}
              placeholder="Detail the objectives, timeline, and deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              id="input-proposal-description"
              required
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Voting Options (2 to 6)
              </label>
              {options.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                >
                  <Plus size={12} /> Add Option
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {options.map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="input-field"
                    placeholder={`Option ${idx + 1}`}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '0.5rem' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ color: '#f87171', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
              id="btn-cancel-create-proposal"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ flex: 2 }}
              id="btn-publish-proposal"
            >
              <Sparkles size={15} />
              {isSubmitting ? 'Deploying to Midnight...' : 'Deploy Proposal to Ledger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
